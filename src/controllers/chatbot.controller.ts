import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbot.service';

export const chatWithBot = async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input) {
       res.status(400).json({ error: 'Message is required' });
    }

    const reply = await ChatbotService.handleUserMessage(input);
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('[Chatbot Error]:', error.message);
    res.status(500).json({ error: 'Something went wrong in chatbot' });
  }
};
