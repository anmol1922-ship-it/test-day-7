import type { ChatService } from "../../src/services/ChatService";
import { ConversationMemory } from "../../src/services/conversationMemory";

export interface FakeChatServiceOptions {
  response?: string | ((message: string) => string);
}

export class FakeChatService implements ChatService {
  readonly calls: string[] = [];
  private readonly response: string | ((message: string) => string);
  private readonly memory = new ConversationMemory();

  constructor(options: FakeChatServiceOptions = {}) {
    this.response =
      options.response ??
      "This is a deterministic CA Buddy response for testing.";
  }

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async *sendMessage(
    conversationId: string,
    message: string,
  ): AsyncGenerator<string, string, void> {
    const normalizedMessage = message.trim();
    const response =
      typeof this.response === "function"
        ? this.response(normalizedMessage)
        : this.response;
    this.calls.push(normalizedMessage);
    this.memory.append(conversationId, {
      role: "user",
      content: normalizedMessage,
    });
    this.memory.append(conversationId, {
      role: "assistant",
      content: response,
    });
    yield response;
    return response;
  }

  async resetConversation(conversationId: string): Promise<void> {
    this.memory.reset(conversationId);
  }

  async close(): Promise<void> {
    return Promise.resolve();
  }
}
