import { ChatbotDAO } from '../dao/chatbot.dao';

export class ChatbotService {
  static async handleUserMessage(message: string) {
    if (!message || typeof message !== 'string') {
      throw new Error('Invalid message input');
    }
    const reply = await ChatbotDAO.getReply(message);
    return reply;
  }
}
