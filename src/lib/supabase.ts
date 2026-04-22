import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Define these in your root OptionPluseApp/.env file
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                    (Constants.expoConfig?.extra?.supabaseUrl as string) || 
                    '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                        (Constants.expoConfig?.extra?.supabaseAnonKey as string) || 
                        '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing! Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to OptionPluseApp/.env or app.json");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
