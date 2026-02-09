import { supabase } from './supabase.client';
import type { AppUser, UserRole } from '../models/user.model';

const TECH_EMAIL = import.meta.env.VITE_TECH_AUTH_EMAIL;
const TECH_PASSWORD = import.meta.env.VITE_TECH_AUTH_PASSWORD;

export const authService = {
  /**
   * Technical authentication flow to ensure a real Supabase session exists.
   * Silently signs in using predefined credentials if no session is found.
   */
  async ensureSession(): Promise<AppUser | null> {
    try {
      // 1. Check for existing session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;

      if (session) {
        return this.mapSupabaseUserToAppUser(session.user);
      }

      // 2. If no session and credentials exist, sign in
      if (TECH_EMAIL && TECH_PASSWORD) {
        console.log('No active session. Performing technical login...');
        const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
          email: TECH_EMAIL,
          password: TECH_PASSWORD,
        });

        if (signInError) throw signInError;
        if (user) return this.mapSupabaseUserToAppUser(user);
      }

      console.warn('No session and no technical credentials found.');
      return null;
    } catch (error) {
      console.error('Error in ensureSession:', error);
      return null;
    }
  },

  async getCurrentUser(): Promise<AppUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return this.mapSupabaseUserToAppUser(user);
  },

  async signIn(email: string, password: string): Promise<AppUser> {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!user) throw new Error('Sign in failed: No user returned');

    return this.mapSupabaseUserToAppUser(user);
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  /**
   * Helper to map Supabase User metadata to our AppUser model
   */
  mapSupabaseUserToAppUser(supabaseUser: any): AppUser {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      role: (supabaseUser.user_metadata?.role as UserRole) || 'technician',
      avatar_url: supabaseUser.user_metadata?.avatar_url,
      created_at: supabaseUser.created_at,
    };
  },
};
