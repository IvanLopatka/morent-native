import { supabase } from '@/utils/supabase/client';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * Returns Stack.Screen `options` that place the logo + profile button
 * inside the native header layer (headerLeft / headerRight).
 *
 * Theory: buttons rendered via headerLeft/headerRight go through React
 * Navigation's native header event system, bypassing the JS animation
 * bridge cycle that causes TouchableOpacity to race with navigation on Android.
 */
export function useNavigationHeader() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAvatarUrl(
        session?.user?.user_metadata?.avatar_url ||
          session?.user?.user_metadata?.picture ||
          null,
      );
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setAvatarUrl(
        session?.user?.user_metadata?.avatar_url ||
          session?.user?.user_metadata?.picture ||
          null,
      );
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleProfilePress = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 600);

    if (isAuthenticated) {
      router.push('/profile' as any);
    } else {
      router.push('/auth' as any);
    }
  };

  return {
    headerShown: true,
    headerStyle: styles.header,
    headerShadowVisible: false,

    headerLeft: () => (
      <TouchableOpacity onPress={() => router.push('/' as any)}>
        <Text style={styles.logo}>MORENT</Text>
      </TouchableOpacity>
    ),

    headerTitle: () => <View />,

    headerRight: () => (
      <TouchableOpacity onPress={handleProfilePress} style={styles.avatar}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.avatarImage}
            contentFit="cover"
          />
        ) : (
          <Image
            source={require('@/assets/images/profile.svg')}
            style={styles.avatarImage}
            contentFit="cover"
          />
        )}
      </TouchableOpacity>
    ),
  };
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
  },
  logo: {
    color: '#3563E9',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
});
