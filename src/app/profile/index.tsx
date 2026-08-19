import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { supabase } from '@/utils/supabase/client';
import { NavigationBar } from '@/components/NavigationBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface UserProfile {
  email?: string;
  name?: string;
  avatarUrl?: string;
  id: string;
  createdAt: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        // Not authenticated, redirect to auth modal
        router.replace('/auth/AuthModal');
        return;
      }
      
      const authUser = session.user;
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Morent Member',
        avatarUrl: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
        createdAt: authUser.created_at,
      });
    } catch (err) {
      router.replace('/auth/AuthModal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      router.replace('/');
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top + Spacing.two,
    },
    ios: {
      paddingTop: safeAreaInsets.top + Spacing.two,
    },
    web: {
      paddingTop: Spacing.four,
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3563E9" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView
      removeClippedSubviews={false}
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={[
        {
          paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.four,
          alignItems: 'center',
        },
        contentPlatformStyle,
      ]}
    >
      <View style={{ width: '100%', maxWidth: MaxContentWidth }}>
        <NavigationBar />
        
        <View className="p-6 w-full items-center">
          <View className="bg-white rounded-3xl p-8 w-full max-w-xl shadow-sm border border-gray-100 items-center">
            
            {/* Avatar / Profile Image */}
            <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-50 bg-gray-100 mb-4 shadow-sm">
              {user.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              ) : (
                <View className="w-full h-full items-center justify-center bg-blue-600">
                  <Text className="text-white text-3xl font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </Text>
                </View>
              )}
            </View>

            {/* Profile Info */}
            <Text className="text-2xl font-bold text-gray-900 mb-1">{user.name}</Text>
            <Text className="text-sm font-medium text-gray-500 mb-6">{user.email}</Text>

            {/* Account Settings / Mock Details */}
            <View className="w-full border-t border-b border-gray-100 py-6 my-2 gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium text-sm">Account Status</Text>
                <View className="bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <Text className="text-green-600 font-bold text-xs">Active Member</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium text-sm">Member Since</Text>
                <Text className="text-gray-800 font-semibold text-sm">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 font-medium text-sm">User ID</Text>
                <Text className="text-gray-400 font-mono text-xs select-all">
                  {user.id.slice(0, 8)}...{user.id.slice(-8)}
                </Text>
              </View>
            </View>

            {/* Actions */}
            <View className="w-full gap-3 mt-6">
              <TouchableOpacity
                onPress={() => router.push('/')}
                className="bg-blue-600 py-3.5 rounded-2xl items-center justify-center shadow-sm"
              >
                <Text className="text-white font-bold text-sm">Back to Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSignOut}
                className="border border-red-200 bg-red-50 py-3.5 rounded-2xl items-center justify-center"
              >
                <Text className="text-red-600 font-bold text-sm">Sign Out</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </View>
    </ScrollView>
  );
}
