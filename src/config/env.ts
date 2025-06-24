import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 3010,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  HF_API_TOKEN: process.env.HF_API_TOKEN,
  DEEP_AI_KEY: process.env.DEEP_AI_KEY,
  REPLICATE_API_TOKEN:process.env.REPLICATE_API_TOKEN
};
