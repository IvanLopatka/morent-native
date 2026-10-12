import { signInWithGoogle } from '@/utils/google-auth';
import { supabase } from '@/utils/supabase/client';
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

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dismissModal = () => {
    if (router.canDismiss()) {
      router.dismiss();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      showAlert('Success', 'Please check your email to verify your account!');
    } catch (error: any) {
      showAlert('Authentication Error', error.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
      dismissModal();
    } catch (error: any) {
      showAlert('Google Auth Error', error.message || 'Authentication failed.');
    } finally {
      setIsLoading(false);
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
          <Text style={styles.headerTitle}>Create your account</Text>

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
            onPress={handleRegister}
            disabled={isLoading}
            style={styles.submitBtn}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Sign Up</Text>
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

          {/* Toggle to Login */}
          <TouchableOpacity
            onPress={() => router.replace('/login' as any)}
            style={styles.toggleBtn}
          >
            <Text style={styles.toggleText}>
              Already have an account? <Text style={styles.toggleHighlight}>Sign In</Text>
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
