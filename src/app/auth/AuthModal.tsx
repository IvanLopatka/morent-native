import { supabase } from '@/utils/supabase/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AuthModal() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dismissModal = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        GoogleSignin.configure({
          webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        });
      } catch (error) {
        console.error('GoogleSignin configure error:', error);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        dismissModal();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        showAlert('Success', 'Please check your email to verify your account!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        dismissModal();
      }
    } catch (error: any) {
      showAlert('Authentication Error', error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      if (Platform.OS === 'web') {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          },
        });
        if (error) throw error;
      } else {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken || (userInfo as any).idToken;

        if (!idToken) {
          throw new Error('No ID token found from Google Sign-In');
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
        dismissModal();
      }
    } catch (error: any) {
      showAlert('Google Auth Error', error.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 items-center justify-center p-6">
      <View className="bg-white rounded-3xl p-8 w-full max-w-md shadow-sm border border-gray-100">

        {/* Close Button */}
        <TouchableOpacity
          onPress={dismissModal}
          className="absolute top-4 right-4 w-8 h-8 items-center justify-center bg-gray-50 rounded-full"
        >
          <Text className="text-gray-400 font-bold text-sm">✕</Text>
        </TouchableOpacity>

        <Text className="text-[#3563E9] text-2xl font-bold tracking-tight text-center mb-2">
          MORENT
        </Text>
        <Text className="text-xl font-bold text-gray-900 text-center mb-6">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </Text>

        {/* Input Fields */}
        <View className="gap-4 mb-6">
          <View className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 flex-row items-center h-12">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              className="flex-1 text-sm font-medium text-gray-800 p-0 outline-none"
            />
          </View>

          <View className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 flex-row items-center h-12">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              autoCapitalize="none"
              className="flex-1 text-sm font-medium text-gray-800 p-0 outline-none"
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleAuth}
          disabled={isLoading}
          className="bg-blue-600 w-full py-3.5 rounded-2xl items-center justify-center shadow-sm mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-bold text-sm">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View className="flex-row items-center my-4">
          <View className="flex-1 h-[1px] bg-gray-200" />
          <Text className="text-xs text-gray-400 px-3 font-semibold">OR</Text>
          <View className="flex-1 h-[1px] bg-gray-200" />
        </View>

        {/* Google Authentication Button */}
        <TouchableOpacity
          onPress={handleGoogleSignIn}
          disabled={isLoading}
          className="flex-row items-center justify-center border border-gray-200 bg-white rounded-2xl py-3 w-full gap-3 shadow-sm mb-6"
        >
          <Text className="text-blue-600 font-black text-base">G</Text>
          <Text className="text-gray-700 font-bold text-sm">
            Continue with Google
          </Text>
        </TouchableOpacity>

        {/* Toggle Mode */}
        <TouchableOpacity
          onPress={() => setIsSignUp(!isSignUp)}
          className="items-center"
        >
          <Text className="text-sm font-medium text-gray-500">
            {isSignUp ? 'Already have an account? ' : 'New to Morent? '}
            <Text className="text-blue-600 font-bold">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Text>
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
