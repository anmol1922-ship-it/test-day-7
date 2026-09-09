import { useState, type FormEvent } from "react";
import { ChatPanel } from "./ChatPanel";
import type { ChatMessage } from "../types/chat";
import type { ChatService } from "../services/ChatService";

export interface ChatShellProps {
  initialMessages?: ChatMessage[];
  onSubmitMessage?: (message: string) => void | Promise<void>;
  chatService?: ChatService;
}

export function ChatShell({
  initialMessages = [],
  onSubmitMessage,
  chatService,
}: ChatShellProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsLoading(true);

    try {
      if (chatService) {
        const assistantId = crypto.randomUUID();
        for await (const chunk of chatService.sendMessage(
          conversationId,
          text,
        )) {
          setMessages((current) => {
            const assistantMessage = current.find(
              (message) => message.id === assistantId,
            );
            if (!assistantMessage) {
              return [
                ...current,
                {
                  id: assistantId,
                  role: "assistant",
                  text: chunk,
                  timestamp: new Date().toISOString(),
                },
              ];
            }

            return current.map((message) =>
              message.id === assistantId
                ? { ...message, text: message.text + chunk }
                : message,
            );
          });
        }
      } else {
        await onSubmitMessage?.(text);
      }
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "I could not complete that response. Please try again or consult a CA.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setDraft("");
    void chatService?.resetConversation(conversationId);
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            CA
          </span>
          <div>
            <h2 className="brand-name">CA Buddy</h2>
            <p className="brand-caption">
              Clarity for the next business decision
            </p>
          </div>
        </div>
        <button
          className="new-chat-button"
          type="button"
          onClick={handleNewChat}
        >
          <span aria-hidden="true">+</span>
          <span>New chat</span>
        </button>
      </header>

      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">India tax and audit, without the fog</p>
        <h1 id="page-title">A calmer first step for tax questions.</h1>
        <p className="intro-copy">
          Get practical context on everyday GST, TDS, ITR, and audit questions
          before you decide what to do next.
        </p>
      </section>

      <ChatPanel
        messages={messages}
        draft={draft}
        isLoading={isLoading}
        onDraftChange={setDraft}
        onSubmit={handleSubmit}
      />

      <p className="disclaimer">
        Informational guidance only. Consult a Chartered Accountant for advice
        specific to your situation.
      </p>
    </main>
  );
}
