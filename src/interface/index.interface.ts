export interface UserProfile {
  id: string;
  name: string;
  profession: string;
  interests?: string[];
  hobbies?: string[];
  preferred_themes?: string[];
  social_accounts?: string[];
  created_at?: string;
}

// src/interface/onboardingSession.interface.ts

export interface OnboardingSession {
  session_id: string;
  user_id?: string | null;
  step?: string | null;
  profession?: string | null;
  interests?: string[] | null;
  hobbies?: string[] | null;
  preferred_themes?: string[] | null;
  full_name?: string | null;
  email?: string | null;
  created_at?: string; // ISO string format (e.g., "2025-06-17T12:34:56Z")
}


export interface UserSocialAccount {
  id?: string;
  user_id: string;
  platform: "instagram" | "linkedin";
  access_token: string;
  account_name: string;
  account_id: string;
  created_at?: string;
}

export interface PostRequest {
  id: string;
  user_id: string;
  session_id: string;
  topic?: string;
  raw_input: string;
  generated_posts: Record<string, string>; // e.g., { variant1: "...", variant2: "..." }
  selected_post?: string;
  feedback?: string;
  created_at?: string;
}
