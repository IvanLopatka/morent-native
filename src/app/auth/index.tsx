import { supabase } from '@/utils/supabase/client';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
          dismissModal();
        } catch (nativeErr: any) {
          console.error('Native Google Sign-In error:', nativeErr);
          throw new Error(
            nativeErr.message || 'Native Google Sign-In failed. Note: Expo Go does not support custom native modules like Google Sign-In.'
          );
        }
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Close Button */}
          <TouchableOpacity
            onPress={dismissModal}
            style={styles.closeBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.brandTitle}>MORENT</Text>
          <Text style={styles.headerTitle}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Text>

          {/* Input Fields */}
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleAuth}
            disabled={isLoading}
            style={styles.submitBtn}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Authentication Button */}
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            style={styles.googleBtn}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Toggle Mode */}
          <TouchableOpacity
            onPress={() => setIsSignUp(!isSignUp)}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account? ' : 'New to Morent? '}
              <Text style={styles.toggleHighlight}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 448,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    zIndex: 10,
  },
  closeBtnText: {
    color: '#9ca3af',
    fontWeight: 'bold',
    fontSize: 14,
  },
  brandTitle: {
    color: '#3563E9',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputWrapper: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    padding: 0,
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 12,
    color: '#9ca3af',
    paddingHorizontal: 12,
    fontWeight: '600',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    width: '100%',
    marginBottom: 24,
  },
  googleIcon: {
    color: '#2563eb',
    fontWeight: '900',
    fontSize: 16,
    marginRight: 12,
  },
  googleBtnText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 14,
  },
  toggleBtn: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  toggleHighlight: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
