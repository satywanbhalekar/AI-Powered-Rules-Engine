

// import express from 'express';
// import fetch from 'node-fetch';
// import dotenv from 'dotenv';

// dotenv.config();
// const router = express.Router();

// function detectIntent(message: string): 'create' | 'update' | 'apply' {
//   const lower = message.toLowerCase();
//   if (lower.includes('update')) return 'update';
//   if (lower.includes('apply')) return 'apply';
//   return 'create'; // default
// }

// router.post('/', async (req, res) => {
//   const userMessage = req.body.input;
//   const tenantId = req.headers['x-tenant-id'] as string;
//   const authHeader = req.headers['authorization'] as string;

//   console.log('🧠 Incoming message:', userMessage);
//   console.log('📌 Detected tenantId:', tenantId);
//   console.log('🔐 Authorization header:', authHeader);

//   const intent = detectIntent(userMessage);
//   console.log('📌 Detected intent:', intent);

//   let url = '';
//   if (intent === 'create') {
//     url = 'http://localhost:3010/api/v1/rules/parse-and-save';
//   } else if (intent === 'update') {
//     url = 'http://localhost:3010/api/v1/rules/parse-and-update';
//   } else if (intent === 'apply') {
//     url = 'http://localhost:3010/api/v1/apply';
//   }

//   try {
//     const apiResponse = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         tenant: 'RuleMaster',
//         client_id: 'node-server',
//         Authorization: authHeader || '',         // ✅ forward incoming token
//         'x-tenant-id': tenantId || '',           // ✅ forward incoming tenant ID
//       },
//       body: JSON.stringify({ input: userMessage })
//     });

//     const data = await apiResponse.json();
    
//     const message = data?.error || data.message;
//     console.log("messagemessage",message);
    
//     res.json({ message, ...data });

//   } catch (error) {
//     console.error('❌ Adapter error:', error);
//     res.status(500).json({ message: '❌ Failed to process request.' });
//   }
// });

// export default router;





import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { chatWithGemini } from '../utils/geminiClient'; // ✅ Import Gemini function

dotenv.config();
const router = express.Router();

// ✅ Detect intent from input
function detectIntent(message: string): 'create' | 'update' | 'apply' | 'chat' {
  const lower = message.toLowerCase();
  if (lower.includes('update')) return 'update';
  if (lower.includes('apply')) return 'apply';
  if (lower.includes('create') || lower.includes('define')) return 'create';
  return 'chat'; // Fallback to chatbot
}

// ✅ Main route: decide whether to call rule engine or chatbot
router.post('/', async (req, res): Promise<void> => {
    const userMessage = req.body.input;
    const tenantId = req.headers['x-tenant-id'] as string;
    const authHeader = req.headers['authorization'] as string;
  
    const intent = detectIntent(userMessage);
    let url = '';
    if (intent === 'create') {
      url = 'http://localhost:3010/api/v1/rules/parse-and-save';
    } else if (intent === 'update') {
      url = 'http://localhost:3010/api/v1/rules/parse-and-update';
    } else if (intent === 'apply') {
      url = 'http://localhost:3010/api/v1/apply';
    }
  
    try {
      if (url) {
        const apiResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            tenant: 'RuleMaster',
            client_id: 'node-server',
            Authorization: authHeader || '',
            'x-tenant-id': tenantId || '',
          },
          body: JSON.stringify({ input: userMessage })
        });
  
        const data = await apiResponse.json();
        const message = data?.error || data.message;
        res.json({ message, ...data }); // ✅ DO NOT return this
        return;
      }
  
      const reply = await chatWithGemini(userMessage);
      console.log("reply",reply);
      const message=reply;
      res.json({message});
      //res.json({ reply }); // ✅ DO NOT return this
    } catch (error: any) {
      console.error('❌ Adapter error:', error.message || error);
      res.status(500).json({ message: '❌ Failed to process request.' });
    }
  });
  

export default router;
