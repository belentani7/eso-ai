export type ChatInput = {
  message: string;
  language: 'es' | 'ca' | 'pt' | 'en';
  history: { role: 'user' | 'assistant'; content: string }[];
};
export function parseChatPayload(raw: unknown): ChatInput;
