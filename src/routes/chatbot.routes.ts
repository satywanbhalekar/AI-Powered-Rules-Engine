import express from 'express';
import { chatWithBot } from '../controllers/chatbot.controller';

const router = express.Router();

router.post('/ask', chatWithBot);

export default router;
