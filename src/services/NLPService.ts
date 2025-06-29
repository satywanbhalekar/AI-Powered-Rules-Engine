
// import axios from 'axios';
// import { GeminiRule } from '../interface/Rule.interface';

// export default class NLPService {
//   static async parseToRule(nlInput: string): Promise<GeminiRule> {
//     console.log('🧠 NLPService.parseToRule: input =', nlInput);

//   // 1️⃣ Pre-check: input must start with "create a rule" or "update a rule"
// const normalizedInput = nlInput.trim().toLowerCase();
// if (
//   !normalizedInput.startsWith('create a rule') &&
//   !normalizedInput.startsWith('update a rule')
// ) {
//   throw new Error('❌ Input must start with "create a rule" or "update a rule".');
// }


//     const prompt = `
// Convert the following natural language statement into a valid JSON rule object compatible with the json-rules-engine.

// 🧩 Your output must include:
// - "name": A short rule name (camelCase or PascalCase)
// - "description": A concise summary of what the rule does
// - "conditions": A valid condition block (using "all"/"any", with proper "fact", "operator", and "value")
// - "event": An object with:
//     - "type": The name of the triggered event
//     - "params": A dictionary of values, such as "reward": "₹50,000" or other relevant key-value pairs extracted from the input.

// ✅ Do not include placeholders like \${input}, nulls, or leave "params" empty. If a reward or value is mentioned, include it explicitly.

// ❌ Do NOT return markdown (no triple backticks), comments, or explanation — only valid JSON.

// Input:
// "${nlInput}"
// `;

//     try {
//       const response = await axios.post(
//         'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
//         {
//           contents: [{ parts: [{ text: prompt }] }]
//         },
//         {
//           params: { key: process.env.GEMINI_API_KEY },
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );

//       const raw = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
//       if (!raw) throw new Error('Gemini did not return a valid rule JSON');

//       const cleaned = raw
//         .replace(/```json|```/g, '')
//         .replace(/^\s*\/\/.*$/gm, '')
//         .trim();

//       console.log('📦 Cleaned JSON from Gemini:', cleaned);

//       const parsed: GeminiRule = JSON.parse(cleaned);
//       return parsed;
//     } catch (err: any) {
//       console.error('❌ Error parsing Gemini rule:', err.message);
//       if (axios.isAxiosError(err)) {
//         console.error('🔍 Gemini API Error:', err.response?.data);
//       }
//       throw err;
//     }
//   }
// }



import axios from 'axios';
import { GeminiRule } from '../interface/Rule.interface';

export default class NLPService {
  static async parseToRule(nlInput: string): Promise<GeminiRule> {
    console.log('🧠 NLPService.parseToRule: input =', nlInput);

  // 1️⃣ Pre-check: input must start with "create a rule" or "update a rule"
const normalizedInput = nlInput.trim().toLowerCase();
if (
  !normalizedInput.startsWith('create a rule') &&
  !normalizedInput.startsWith('update a rule')
) {
  throw new Error('❌ Input must start with "create a rule" or "update a rule".');
}
const prompt = `
Convert the following natural language statement into a valid JSON rule object compatible with the json-rules-engine.

🧩 Your output must include:
- "name": A short rule name (camelCase or PascalCase)
- "description": A concise summary of what the rule does
- "conditions": A valid condition block (using "all"/"any", with proper "fact", "operator", and "value")
- "event": An object with:
    - "type": The name of the triggered event
   - "params": Must include only a "grade" key (e.g., { "grade": "A+" }). Do not use other keys like "status", "bonus", or "label".

✅ Only use "marks" as the fact in conditions (e.g., { fact: "marks", operator: "...", value: ... })

❌ Do NOT use any other facts (e.g., score, grade, name). Do NOT return markdown or comments.

Input:
"${nlInput}"
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
      if (!raw) throw new Error('Gemini did not return a valid rule JSON');

      const cleaned = raw
        .replace(/```json|```/g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        .trim();

      console.log('📦 Cleaned JSON from Gemini:', cleaned);

      const parsed: GeminiRule = JSON.parse(cleaned);
      return parsed;
    } catch (err: any) {
      console.error('❌ Error parsing Gemini rule:', err.message);
      if (axios.isAxiosError(err)) {
        console.error('🔍 Gemini API Error:', err.response?.data);
      }
      throw err;
    }
  }
}

