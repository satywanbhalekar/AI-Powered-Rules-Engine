

// import axios from 'axios';

// export default class FactNLPService {
// static async extractFacts(nlInput: string): Promise<Record<string, any>> {
// console.log('🔍 FactNLPService.extractFacts: input =', nlInput);


// const prompt = `
// Extract structured JSON facts from the following sentence. Return only a JSON object (no markdown or explanation). Required fields:

// employeeName (capitalize first letter)

// unitsSold (as a number)

// Input: "${nlInput}"
// `;

// try {
//   const response = await axios.post(
//     'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
//     {
//       contents: [{ parts: [{ text: prompt }] }]
//     },
//     {
//       params: { key: process.env.GEMINI_API_KEY },
//       headers: { 'Content-Type': 'application/json' }
//     }
//   );

//   const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

//   if (!raw) throw new Error('Gemini returned empty response');

//   // 🧹 Clean markdown or extra formatting
//   const cleaned = raw.replace(/^```json|```$/gm, '').trim();

//   console.log('📦 Gemini raw facts:', cleaned);

//   const parsed = JSON.parse(cleaned);
//   if (!parsed.employeeName || parsed.unitsSold == null) {
//     throw new Error('Missing required fact fields from Gemini output');
//   }

//   return parsed;
// } catch (err: any) {
//   console.error('❌ Error parsing facts with Gemini:', err.message);
//   throw err;
// }
// }
// }


import axios from 'axios';

export default class FactNLPService {
static async extractFacts(nlInput: string): Promise<Record<string, any>> {
console.log('🔍 FactNLPService.extractFacts: input =', nlInput);


const prompt = `
Extract structured JSON facts from the following sentence. Return only a JSON object (no markdown or explanation). Make sure field names are camelCase and values are appropriate.

Input: "${nlInput}"
`;


try {
  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    {
      contents: [{ parts: [{ text: prompt }] }]
    },
    {
      params: { key: process.env.GEMINI_API_KEY },
      headers: { 'Content-Type': 'application/json' }
    }
  );

  const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!raw) throw new Error('Gemini returned empty response');

  const cleaned = raw.replace(/^```json|```$/gm, '').trim();
  console.log('📦 Gemini raw facts:', cleaned);

  const parsed = JSON.parse(cleaned);

  // ✅ Return any valid object
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Gemini did not return a valid JSON object');
  }

  return parsed;
} catch (err: any) {
  console.error('❌ Error parsing facts with Gemini:', err.message);
  throw err;
}
}
}