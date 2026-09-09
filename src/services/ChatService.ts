export interface ChatService {
  initialize(config?: Record<string, unknown>): Promise<void>;
  sendMessage(
    conversationId: string,
    message: string,
  ): AsyncGenerator<string, string, void>;
  resetConversation(conversationId: string): Promise<void>;
  close(): Promise<void>;
}
