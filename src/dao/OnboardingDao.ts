import {supabase} from '../config/db';
import { OnboardingSession, UserProfile } from '../interface/index.interface';
export class OnboardingDao {
    
    static async findSessionByEmail(email: string, password: string) {
      const { data, error } = await supabase
        .from("onboarding_sessions")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
    
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data;
    }
    static async createSessionWithEmaillogin(email: string, password: any): Promise<string> {
      const { data, error } = await supabase
        .from("onboarding_sessions")
        .insert({
          email,
          password,
          step: 'profession'
        })
        .select("session_id")
        .single();
  
      if (error) throw new Error(error.message);
      return data.session_id;
    }

      static async createSessionWithEmail(email: string, full_name: string, password: any): Promise<string> {
        const { data, error } = await supabase
          .from("onboarding_sessions")
          .insert({
            email,
            full_name,
            password,
            step: 'profession'
          })
          .select("session_id")
          .single();
    
        if (error) throw new Error(error.message);
        return data.session_id;
      }


    static async getSession(sessionId: string) {
      const { data, error } = await supabase
        .from("onboarding_sessions")
        .select("*")
        .eq("session_id", sessionId)
        .single();
  
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      return data;
    }
  
    static async createSession(): Promise<string> {
      const { data, error } = await supabase
        .from("onboarding_sessions")
        .insert({ step: 'profession' })
        .select("session_id")
        .single();
  
      if (error) throw new Error(error.message);
      return data.session_id;
    }
  
    static async updateSession(sessionId: string, updates: Partial<UserProfile> & { step: string }) {
      const { error } = await supabase
        .from("onboarding_sessions")
        .update(updates)
        .eq("session_id", sessionId);
  
      if (error) throw new Error(error.message);
    }

    static async getProfileBysession_id(session_id: string): Promise<OnboardingSession> {
      const { data, error } = await supabase
        .from('onboarding_sessions')
        .select('*')
        .eq('session_id', session_id)
        .single();
  
      if (error) throw new Error(error.message);
      return data;
    }
  }
  