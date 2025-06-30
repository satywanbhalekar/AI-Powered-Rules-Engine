import { chatWithGemini } from '../utils/geminiClient';

export class ChatbotDAO {
  static async getReply(message: string) {
    return await chatWithGemini(message);
  }
}
