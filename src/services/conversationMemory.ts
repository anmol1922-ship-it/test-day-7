export type MemoryRole = "user" | "assistant";

export interface MemoryMessage {
  role: MemoryRole;
  content: string;
}

export class ConversationMemory {
  private readonly conversations = new Map<string, MemoryMessage[]>();

  getMessages(conversationId: string): readonly MemoryMessage[] {
    return [...(this.conversations.get(conversationId) ?? [])];
  }

  append(conversationId: string, message: MemoryMessage): void {
    const messages = this.conversations.get(conversationId) ?? [];
    messages.push({ ...message });
    this.conversations.set(conversationId, messages);
  }

  reset(conversationId: string): void {
    this.conversations.delete(conversationId);
  }

  clear(): void {
    this.conversations.clear();
  }
}
