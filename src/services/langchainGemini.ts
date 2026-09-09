import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  type BaseMessage,
} from "@langchain/core/messages";
import type { ChatService } from "./ChatService";
import { ConversationMemory } from "./conversationMemory";
import caPersonaPrompt from "../prompts/ca_persona.txt?raw";

interface StreamableModel {
  stream(messages: BaseMessage[]): Promise<AsyncIterable<{ content: unknown }>>;
}

export interface LangChainGeminiOptions {
  apiKey?: string;
  model?: string;
  maxOutputTokens?: number;
  memory?: ConversationMemory;
  modelClient?: StreamableModel;
}

export const CA_PERSONA_PROMPT = caPersonaPrompt.trim();

function contentToText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }

      if (part && typeof part === "object" && "text" in part) {
        return typeof part.text === "string" ? part.text : "";
      }

      return "";
    })
    .join("");
}

export class LangChainGeminiChatService implements ChatService {
  private readonly apiKey?: string;
  private readonly modelName: string;
  private readonly maxOutputTokens: number;
  private readonly memory: ConversationMemory;
  private modelClient?: StreamableModel;

  constructor(options: LangChainGeminiOptions = {}) {
    this.apiKey = options.apiKey ?? import.meta.env.VITE_GOOGLE_API_KEY;
    this.modelName = options.model ?? "gemma-4-26b-a4b-it";
    this.maxOutputTokens = options.maxOutputTokens ?? 4096;
    this.memory = options.memory ?? new ConversationMemory();
    this.modelClient = options.modelClient;
  }

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  private getModelClient(): StreamableModel {
    if (this.modelClient) {
      return this.modelClient;
    }

    if (!this.apiKey) {
      throw new Error("VITE_GOOGLE_API_KEY is required to contact Gemini.");
    }

    this.modelClient = new ChatGoogleGenerativeAI({
      apiKey: this.apiKey,
      model: this.modelName,
      maxOutputTokens: this.maxOutputTokens,
      temperature: 0.2,
    });
    return this.modelClient;
  }

  async *sendMessage(
    conversationId: string,
    message: string,
  ): AsyncGenerator<string, string, void> {
    const normalizedMessage = message.trim();
    if (!normalizedMessage) {
      throw new Error("A question is required.");
    }

    const history = this.memory.getMessages(conversationId);
    const modelMessages: BaseMessage[] = [new SystemMessage(CA_PERSONA_PROMPT)];
    for (const entry of history) {
      modelMessages.push(
        entry.role === "user"
          ? new HumanMessage(entry.content)
          : new AIMessage(entry.content),
      );
    }
    modelMessages.push(new HumanMessage(normalizedMessage));

    let response = "";
    const stream = await this.getModelClient().stream(modelMessages);
    for await (const chunk of stream) {
      const text = contentToText(chunk.content);
      if (!text) {
        continue;
      }

      response += text;
      yield text;
    }

    this.memory.append(conversationId, {
      role: "user",
      content: normalizedMessage,
    });
    this.memory.append(conversationId, {
      role: "assistant",
      content: response,
    });
    return response;
  }

  async resetConversation(conversationId: string): Promise<void> {
    this.memory.reset(conversationId);
  }

  async close(): Promise<void> {
    return Promise.resolve();
  }
}
