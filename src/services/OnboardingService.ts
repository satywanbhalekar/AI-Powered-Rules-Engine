import { supabase } from '../config/db';
import { OnboardingDao } from '../dao/OnboardingDao';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export class OnboardingService {


  // static async startSessionforlogin(email: string, password: string) {
  //   // Step 1: Check if email exists regardless of password
  //   const { data: emailCheckData, error: emailCheckError } = await supabase
  //     .from("onboarding_sessions")
  //     .select("*")
  //     .eq("email", email)
  //     .order("created_at", { ascending: false })
  //     .limit(1)
  //     .single();

  //   if (emailCheckError && emailCheckError.code !== 'PGRST116') {
  //     throw new Error(emailCheckError.message);
  //   }

  //   // Step 2: Email exists
  //   if (emailCheckData) {
  //     console.log(emailCheckData);
  //     console.log(password);
  //     const isMatch = await bcrypt.compare(password, emailCheckData.password);
  //     const token = jwt.sign(
  //       { session_id: emailCheckData.session_id, email: emailCheckData.email },
  //       process.env.JWT_SECRET || 'default-secret', // Replace with env var in production
  //       { expiresIn: '1h' }
  //     );
  //     if (isMatch) {
  //       // ✅ Password match: login
  //       if (emailCheckData.step === 'complete') {
  //         return {
  //           session_id: emailCheckData.session_id,
  //           full_name: emailCheckData.full_name,
  //           //message: `Welcome back, ${emailCheckData.full_name || 'User'}! You’re already onboarded.`
  //           message: "login success",
  //           token
  //         };
  //       } else {
  //         return {
  //           session_id: emailCheckData.session_id,
  //           full_name: emailCheckData.full_name,
  //           // message: `Welcome back, ${emailCheckData.full_name || 'User'}! Let’s continue onboarding. Your current step is: ${emailCheckData.step}`
  //           message: "login success",
  //           token
  //         };
  //       }
  //     } else {
  //       // ❌ Password doesn't match
  //       return {
  //         error: "Invalid credentials"
  //       };
  //     }
  //   }

  //   // Step 3: Email is new — create onboarding session
  //   const newSessionId = await OnboardingDao.createSessionWithEmaillogin(email, password);
  //   return {
  //     session_id: newSessionId,
  //     // message: `Welcome ${full_name}! Let’s begin your onboarding.`
  //     massage: "success"
  //   };
  // }

  static async startSessionforlogin(email: string, password: string) {
    // Step 1: Check if email exists
    const { data: emailCheckData, error: emailCheckError } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
  
    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      throw new Error(emailCheckError.message);
    }
  
    // ❌ Email not found
    if (!emailCheckData) {
      return {
        error: "Email not found. Please sign up first."
      };
    }
  
    // Step 2: Password check
    const isMatch = await bcrypt.compare(password, emailCheckData.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }
  
    // ✅ Login success
    const token = jwt.sign(
      { session_id: emailCheckData.session_id, email: emailCheckData.email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1h' }
    );
  
    return {
      session_id: emailCheckData.session_id,
      full_name: emailCheckData.full_name,
      token,
      message: "login success"
    };
  }

  // static async startSession(email: string, full_name: string, password: string) {
  //   // Step 1: Check if email exists regardless of password
  //   const { data: emailCheckData, error: emailCheckError } = await supabase
  //     .from("onboarding_sessions")
  //     .select("*")
  //     .eq("email", email)
  //     .order("created_at", { ascending: false })
  //     .limit(1)
  //     .single();
  //     const token = jwt.sign(
  //       { session_id: newSessionId, email },
  //       process.env.JWT_SECRET || 'default-secret',
  //       { expiresIn: '1h' }
  //     );
  //   if (emailCheckError && emailCheckError.code !== 'PGRST116') {
  //     throw new Error(emailCheckError.message);
  //   }

  //   // Step 2: Email exists
  //   if (emailCheckData) {
  //     console.log(emailCheckData);
  //     console.log(password);

  //     if (emailCheckData.password === password) {
  //       // ✅ Password match: login
  //       if (emailCheckData.step === 'complete') {
  //         return {
  //           session_id: emailCheckData.session_id,
  //           message: `Welcome back, ${emailCheckData.full_name || 'User'}! You’re already onboarded.`,
  //           token
  //         };
  //       } else {
  //         return {
  //           session_id: emailCheckData.session_id,
  //           message: `Welcome back, ${emailCheckData.full_name || 'User'}! Let’s continue onboarding. Your current step is: ${emailCheckData.step}`,
  //           token
  //         };
  //       }
  //     } else {
  //       // ❌ Password doesn't match
  //       return {
  //         error: "Email already used. Please log in."
  //       };
  //     }
  //   }

  //   // Step 3: Email is new — create onboarding session

  //   const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds
  //   const newSessionId = await OnboardingDao.createSessionWithEmail(email, full_name, hashedPassword);
    
  //   return {
  //     session_id: newSessionId,
  //     full_name: full_name,
  //     // message: `Welcome ${full_name}! Let’s begin your onboarding.`
  //     massage: "success"
  //   };
  // }

  static async startSession(email: string, full_name: string, password: string) {
    const { data: emailCheckData, error: emailCheckError } = await supabase
      .from("onboarding_sessions")
      .select("*")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
  
    if (emailCheckError && emailCheckError.code !== 'PGRST116') {
      throw new Error(emailCheckError.message);
    }
  
    if (emailCheckData) {
      return {
        error: "Email already used. Please log in."
      };
    }
  
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newSessionId = await OnboardingDao.createSessionWithEmail(email, full_name, hashedPassword);
  
    // Generate token
    const token = jwt.sign(
      { session_id: newSessionId, email },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '1h' }
    );
  
    return {
      session_id: newSessionId,
      full_name: full_name,
      token,
      message: "Signup successful"
    };
  }
  

  static async handleInput(sessionId: string | null, input: string | Record<string, any>) {
    console.log("👉 Input received:", input);
    console.log("👉 Session ID:", sessionId);

    let session;

    // Step 0: No session — create one and return welcome message
    if (!sessionId) {
      const newSessionId = await OnboardingDao.createSession();
      console.log("🆕 New session created:", newSessionId);
      return {
        session_id: newSessionId,
        message: "Welcome! Let's get you set up. What's your profession?"
      };
    }

    // Step 1: Get session
    // eslint-disable-next-line prefer-const
    session = await OnboardingDao.getSession(sessionId);
    console.log("📦 Existing session:", session);

    const { step } = session;

    // Step 2: If already complete
    if (step === "complete") {
      console.log("✅ Already onboarded.");
      return { message: "You're already onboarded. You can now generate posts!" };
    }

    // Step 3: If structured object is passed, update all at once
    const isStructured =
      typeof input === 'object' &&
      input.profession &&
      input.interests &&
      input.hobbies &&
      input.preferred_themes;

    if (isStructured) {
      const interests = Array.isArray(input.interests)
        ? input.interests
        : input.interests.split(",").map((i: string) => i.trim());

      const hobbies = Array.isArray(input.hobbies)
        ? input.hobbies
        : input.hobbies.split(",").map((h: string) => h.trim());

      const themes = Array.isArray(input.preferred_themes)
        ? input.preferred_themes
        : input.preferred_themes.split(",").map((t: string) => t.trim());

      const updateData = {
        profession: input.profession,
        interests,
        hobbies,
        preferred_themes: themes,
        step: "complete"
      };

      console.log("📤 Updating session with full profile:", updateData);

      await OnboardingDao.updateSession(sessionId, updateData);

      console.log("✅ Profile saved successfully.");

      return { message: "All set! Your profile is complete 🎉,You can now generate posts!" };
    }

    console.log("⚠️ Input not complete. Falling back to step-by-step flow.");
    return { message: "Please complete your onboarding step-by-step." };
  }




}
