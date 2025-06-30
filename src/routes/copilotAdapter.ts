

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

function detectIntent(message: string): 'create' | 'update' | 'apply' {
  const lower = message.toLowerCase();
  if (lower.includes('update')) return 'update';
  if (lower.includes('apply')) return 'apply';
  return 'create'; // default
}

router.post('/', async (req, res) => {
  const userMessage = req.body.input;
  const tenantId = req.headers['x-tenant-id'] as string;
  const authHeader = req.headers['authorization'] as string;

  console.log('🧠 Incoming message:', userMessage);
  console.log('📌 Detected tenantId:', tenantId);
  console.log('🔐 Authorization header:', authHeader);

  const intent = detectIntent(userMessage);
  console.log('📌 Detected intent:', intent);

  let url = '';
  if (intent === 'create') {
    url = 'http://localhost:3010/api/v1/rules/parse-and-save';
  } else if (intent === 'update') {
    url = 'http://localhost:3010/api/v1/rules/parse-and-update';
  } else if (intent === 'apply') {
    url = 'http://localhost:3010/api/v1/apply';
  }

  try {
    const apiResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        tenant: 'RuleMaster',
        client_id: 'node-server',
        Authorization: authHeader || '',         // ✅ forward incoming token
        'x-tenant-id': tenantId || '',           // ✅ forward incoming tenant ID
      },
      body: JSON.stringify({ input: userMessage })
    });

    const data = await apiResponse.json();
    
    const message = data?.error || data.message;
    console.log("messagemessage",message);
    
    res.json({ message, ...data });

  } catch (error) {
    console.error('❌ Adapter error:', error);
    res.status(500).json({ message: '❌ Failed to process request.' });
  }
});

export default router;





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
//   const messages = req.body?.variables?.data?.messages || [];
//   const lastUserMessageObj = messages.reverse().find(
//     (msg: any) => msg.textMessage?.content && msg.textMessage?.role === 'user'
//   );

//   const userMessage = lastUserMessageObj?.textMessage?.content || '';
//   const threadId = req.body?.variables?.data?.threadId || 'thread-placeholder';
//   const runId = req.body?.variables?.data?.runId || 'run-placeholder';

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
//         Authorization: authHeader || '',
//         'x-tenant-id': tenantId || '',
//       },
//       body: JSON.stringify({ input: userMessage }),
//     });

//     const data = await apiResponse.json();
//     const messageContent =
//       data?.message || data?.result || '✅ Operation completed successfully.';

//     res.json({
//       data: {
//         generateCopilotResponse: {
//           threadId,
//           runId,
//           messages: [
//             {
//               __typename: 'TextMessageOutput',
//               content: messageContent,
//               role: 'assistant',
//               parentMessageId: lastUserMessageObj?.id || null,
//             },
//           ],
//           metaEvents: [],
//           __typename: 'CopilotResponse',
//         },
//       },
//     });

//   } catch (error) {
//     console.error('❌ Adapter error:', error);

//     res.status(500).json({
//       data: {
//         generateCopilotResponse: {
//           threadId,
//           runId,
//           messages: [
//             {
//               __typename: 'TextMessageOutput',
//               content: '❌ Failed to process request.',
//               role: 'assistant',
//               parentMessageId: null,
//             },
//           ],
//           metaEvents: [],
//           __typename: 'CopilotResponse',
//         },
//       },
//     });
//   }
// });

// export default router;
