import type { FormEvent } from "react";
import type { ChatMessage } from "../types/chat";

interface ChatPanelProps {
  messages: ChatMessage[];
  draft: string;
  isLoading?: boolean;
  onDraftChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ChatPanel({
  messages,
  draft,
  isLoading = false,
  onDraftChange,
  onSubmit,
}: ChatPanelProps) {
  return (
    <section className="chat-panel" aria-labelledby="chat-panel-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Your questions, made clearer</p>
          <h2 id="chat-panel-title">Ask about Indian tax and audit basics</h2>
        </div>
        <span className="status-dot" aria-label="CA Buddy ready" />
      </div>

      <div
        className="message-log"
        role="log"
        aria-live="polite"
        aria-label="Conversation"
      >
        {messages.length === 0 ? (
          <div className="empty-state">
            <span className="empty-mark" aria-hidden="true">
              ?
            </span>
            <p>
              Try a question about GST, TDS, ITR deadlines, or audit basics.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <article
              className={`message message-${message.role}`}
              key={message.id}
            >
              <p className="message-label">
                {message.role === "user" ? "You" : "CA Buddy"}
              </p>
              <p>{message.text}</p>
            </article>
          ))
        )}
        {isLoading && (
          <div className="typing-state" role="status">
            <span />
            <span />
            <span />
            <span className="sr-only">CA Buddy is thinking</span>
          </div>
        )}
      </div>

      <form className="composer" onSubmit={onSubmit}>
        <label htmlFor="question-input">Your question</label>
        <div className="composer-row">
          <textarea
            id="question-input"
            name="question"
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            placeholder="e.g. Do I need to deduct TDS on this payment?"
            rows={2}
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !draft.trim()}>
            <span>Send</span>
            <span aria-hidden="true">-&gt;</span>
          </button>
        </div>
      </form>
    </section>
  );
}
