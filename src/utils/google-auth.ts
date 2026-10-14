import { supabase } from '@/utils/supabase/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export async function signInWithGoogle() {
  if (Platform.OS === 'web') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      },
    });
    if (error) throw error;
  } else {
    const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    if (!webClientId) {
      throw new Error('Google Sign-In is not configured. Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in .env.');
    }

    try {
      GoogleSignin.configure({
        webClientId,
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || (userInfo as any).idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google Sign-In.');
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        console.error('Authorization error:', error.message);
        throw error;
      }

      console.log('Successfully authenticated with Supabase:', data.user);
      return data;
    } catch (nativeErr: any) {
      console.error('Native Google Sign-In error:', nativeErr);
      throw new Error(
        nativeErr.message ||
          'Native Google Sign-In failed. Note: Expo Go does not support custom native modules like Google Sign-In.'
      );
    }
  }
}
