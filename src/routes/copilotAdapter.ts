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
//   console.log('🧠 Incoming message:', userMessage);

//   const intent = detectIntent(userMessage);
//   console.log('📌 Detected intent:', intent);

//   // Decide endpoint based on intent
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
//         'tenant': 'RuleMaster',
//         'client_id': 'node-server',
//         'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN || ''}`,
//         'x-tenant-id': '2d20c76f-852b-47a7-b6ce-d4fcd71b34dc'
//       },
//       body: JSON.stringify({ input: userMessage })
//     });

//     const data = await apiResponse.json();
//     const message = data?.message || '✅ Operation completed successfully.';
//     res.json({ message });
//   } catch (error) {
//     console.error('❌ Adapter error:', error);
//     res.status(500).json({ message: '❌ Failed to process request.' });
//   }
// });

// export default router;

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
  console.log('🧠 Incoming message:', userMessage);

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
        Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN || ''}`,
        'x-tenant-id': '2d20c76f-852b-47a7-b6ce-d4fcd71b34dc'
      },
      body: JSON.stringify({ input: userMessage })
    });

    const data = await apiResponse.json();
    const message = data?.message || '✅ Operation completed successfully.';
    res.json({ message, ...data });

  } catch (error) {
    console.error('❌ Adapter error:', error);
    res.status(500).json({ message: '❌ Failed to process request.' });
  }
});

export default router;
