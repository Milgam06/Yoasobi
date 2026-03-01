import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublicKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLIC_KEY;

if (!supabaseUrl || !supabasePublicKey) {
  throw new Error('Supabase URL or Public Key is not defined');
}

const isPlatformWeb = Platform.OS === 'web';

const supabase = createClient(supabaseUrl, supabasePublicKey, {
  auth: {
    ...(isPlatformWeb ? {} : { storage: AsyncStorage }),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

if (!isPlatformWeb) {
  AppState.addEventListener('change', (state) => {
    const isAppStateActive = state === 'active';
    if (isAppStateActive) {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

const supabaseAuth = supabase.auth;

export { supabase, supabaseAuth };
