# Data Model: CA Buddy

## Entities

- Entity: Conversation
  - Fields:
    - `id`: string (in-memory, ephemeral)
    - `messages`: Message[] (ordered)
    - `createdAt`: ISO timestamp
    - `updatedAt`: ISO timestamp
  - Validation: `messages` may be empty; Conversation is not persisted to disk.

- Entity: Message
  - Fields:
    - `id`: string
    - `role`: `user` | `assistant` | `system`
    - `text`: string
    - `timestamp`: ISO timestamp
  - Validation: `text` non-empty for user messages; system messages may be seeded from persona file.

- Entity: PersonaPrompt
  - Fields:
    - `path`: string (src/prompts/ca_persona.txt)
    - `content`: string
  - Validation: file must exist in repo; used as system prompt input to `ChatService`.

## State Transitions

- New Chat: creates a new Conversation instance (clears in-memory messages).
- Submit Message: append `user` Message, call `ChatService`, append streaming `assistant` Message parts, finalize assistant message.
