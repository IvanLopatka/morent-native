import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://plxsgjaqcvxlkbodfqbx.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBseHNnamFxY3Z4bGtib2RmcWJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4MTY2MzIsImV4cCI6MjA4MjM5MjYzMn0.wuFas-MTiFzd6DBCke70UHMJK2zjHflYv93JCohHDio';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export function createClientInstance() {
  return supabase;
}
