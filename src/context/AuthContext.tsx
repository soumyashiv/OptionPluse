import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const IS_DUMMY_SUPABASE = !SUPABASE_URL || SUPABASE_URL.includes('dummy.supabase.co');

type UserProfile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  default_index: 'NIFTY' | 'BANKNIFTY' | 'FINNIFTY';
  push_notifications: boolean;
  dark_mode: boolean;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  isGuest: true,
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    if (IS_DUMMY_SUPABASE) return;
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('[AuthContext] Error fetching profile:', error.message);
        return;
      }
      if (data) setProfile(data as UserProfile);
    } catch (e) {
      console.error('[AuthContext] Network error fetching profile:', e);
    }
  };

  useEffect(() => {
    let active = true;

    if (IS_DUMMY_SUPABASE) {
      // Dev mode: mock a guest session so the app navigates to Main
      console.warn('[AuthContext] Using mock session — set real Supabase keys in .env');
      const dummyUser: User = {
        id: 'guest-id',
        aal: 'aal1',
        role: 'authenticated',
        email: 'guest@optionpluse.com',
        created_at: '',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
      } as User;
      setUser(dummyUser);
      setSession({
        user: dummyUser,
        access_token: 'guest-token',
        refresh_token: 'guest-refresh',
        expires_in: 3600,
        token_type: 'bearer',
      } as Session);
      setProfile({
        id: dummyUser.id,
        full_name: 'Guest Trader',
        avatar_url: null,
        phone: null,
        default_index: 'NIFTY',
        push_notifications: true,
        dark_mode: false,
      });
      setLoading(false);
      return;
    }

    // Real Supabase flow
    supabase.auth
      .getSession()
      .then(async ({ data: { session }, error }) => {
        if (!active) return;
        if (error) console.error('[AuthContext] Session fetch error:', error.message);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user?.id) await fetchProfile(session.user.id);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[AuthContext] getSession failed:', err);
        if (active) setLoading(false);
      });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user?.id) await fetchProfile(user.id);
  };

  const isGuest = IS_DUMMY_SUPABASE || !session;

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, isGuest, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
