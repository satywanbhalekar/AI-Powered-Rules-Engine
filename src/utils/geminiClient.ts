// import { GoogleGenerativeAI } from '@google/generative-ai';
// import config from '../config/env';

// const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// // export async function generatePostWithGemini(prompt: string): Promise<Record<string, string>> {
// //   const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// //   const result = await model.generateContent(prompt);
// //   const response = await result.response;
// //   const text = response.text();

// //   // You can split the response into variants if needed.
// //   const variants = text.split('\n').filter(Boolean);

// //   return {
// //     variant1: variants[0] || '',
// //     variant2: variants[1] || '',
// //     variant3: variants[2] || '',
// //   };
// // }
// export async function generatePostWithGemini(prompt: string): Promise<Record<string, string>> {
//     const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
  
//     const variants = text
//       .split(/\n+/)
//       .filter((line: string) => line.trim())
//       .slice(0, 3); // Only 3 variants
  
//     return {
//       variant1: variants[0] || '',
//       variant2: variants[1] || '',
//       variant3: variants[2] || '',
//     };
//   }


// import axios from 'axios';
// import config from '../config/env';

// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// export async function generatePostWithGemini(prompt: string): Promise<Record<string, string>> {
//   try {
//     const response = await axios.post(
//       `${GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`,
//       {
//         contents: [
//           {
//             parts: [{ text: prompt }]
//           }
//         ]
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
//     const variants = text
//       .split(/\n+/)
//       .filter((line: string) => line.trim())
//       .slice(0, 3);

//     return {
//       variant1: variants[0] || '',
//       variant2: variants[1] || '',
//       variant3: variants[2] || '',
//     };
//   } catch (error: any) {
//     console.error('[Gemini API Error]:', error.response?.data || error.message);
//     throw new Error('Failed to generate content from Gemini API.');
//   }
// }


import axios from 'axios';
import config from '../config/env';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function generatePostWithGemini(prompt: string): Promise<Record<string, string>> {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${config.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    let text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Remove markdown formatting if exists
    text = text.replace(/```json|```/g, '').trim();
    
    const parsed = JSON.parse(text);

    // Validate structure
    if (
      typeof parsed.variant1 === 'string' &&
      typeof parsed.variant2 === 'string' &&
      typeof parsed.variant3 === 'string'
    ) {
      return parsed;
    } else {
      throw new Error('Gemini response missing required variants');
    }

  } catch (error: any) {
    console.error('[Gemini API Error]:', error.response?.data || error.message);
    throw new Error('Failed to generate content from Gemini API.');
  }
}
