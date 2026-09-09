import { useState } from "react";
import { ChatShell } from "./components/ChatShell";
import { LangChainGeminiChatService } from "./services/langchainGemini";

export function App() {
  const [chatService] = useState(() => new LangChainGeminiChatService());

  return <ChatShell chatService={chatService} />;
}
