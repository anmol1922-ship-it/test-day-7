# Contract: ChatService (interface)

This document defines the `ChatService` interface used by the UI and by tests.

## Interface

- `initialize(config?: Record<string, any>): Promise<void>`
  - Purpose: optional setup (e.g., configure LangChain client) before first use.

- `sendMessage(conversationId: string, message: string): AsyncGenerator<string, string, void>`
  - Purpose: streams partial assistant text as the model responds; yields string chunks.
  - Returns: on completion, returns the final assistant message text.

- `resetConversation(conversationId: string): Promise<void>`
  - Purpose: clears in-memory conversation state for the given id.

- `close(): Promise<void>`
  - Purpose: cleanup resources, cancel ongoing streams.

## Implementations

- `FakeChatService` (tests)
  - Deterministic responses; supports fast-forwarding and configurable latency for unit tests.

- `LangChainGeminiChatService` (production)
  - Uses `@langchain/google-genai` in the browser; reads system prompt from `src/prompts/ca_persona.txt`.
  - Requires `VITE_GOOGLE_API_KEY` provided in environment.

## Contract Notes

- All implementations MUST not persist keys or conversation state to disk.
- Unit tests MUST use `FakeChatService` per constitution.
