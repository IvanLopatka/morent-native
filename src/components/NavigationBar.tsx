import { supabase } from '@/utils/supabase/client';
import { Image } from 'expo-image';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NavItemConfig {
  id: 'home' | 'catalog' | 'settings' | 'profile';
  label: string;
  route: string;
  icon: any;
  activeIcon: any;
  isActive: (pathname: string) => boolean;
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    id: 'home',
    label: 'Home',
    route: '/',
    icon: require('@/assets/images/nav-home.svg'),
    activeIcon: require('@/assets/images/nav-home-active.svg'),
    isActive: (pathname: string) => pathname === '/',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    route: '/catalog',
    icon: require('@/assets/images/nav-catalog.svg'),
    activeIcon: require('@/assets/images/nav-catalog-active.svg'),
    isActive: (pathname: string) =>
      pathname === '/catalog' ||
      pathname.startsWith('/catalog') ||
      pathname === '/explore',
  },
  {
    id: 'settings',
    label: 'Settings',
    route: '/settings',
    icon: require('@/assets/images/nav-settings.svg'),
    activeIcon: require('@/assets/images/nav-settings-active.svg'),
    isActive: (pathname: string) =>
      pathname === '/settings' || pathname.startsWith('/settings'),
  },
  {
    id: 'profile',
    label: 'Profile',
    route: '/profile',
    icon: require('@/assets/images/nav-profile.svg'),
    activeIcon: require('@/assets/images/nav-profile-active.svg'),
    isActive: (pathname: string) =>
      pathname === '/profile' || pathname.startsWith('/profile'),
  },
];

export function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const safeAreaInsets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        setIsAuthenticated(!!session);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setIsAuthenticated(!!session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Hide the navigation bar on modal / auth pages
  if (pathname === '/auth' || pathname?.startsWith('/auth')) {
    return null;
  }

  const handlePress = (item: NavItemConfig) => {
    if (item.id === 'profile') {
      if (isAuthenticated) {
        if (pathname !== '/profile') {
          router.push('/profile' as any);
        }
      } else {
        router.push('/auth' as any);
      }
      return;
    }

    if (item.id === 'home') {
      if (pathname !== '/') {
        router.push('/' as any);
      }
      return;
    }

    if (item.id === 'catalog') {
      if (!pathname.startsWith('/catalog')) {
        router.push('/catalog' as any);
      }
      return;
    }

    if (item.id === 'settings') {
      if (!pathname.startsWith('/settings')) {
        router.push('/settings' as any);
      }
      return;
    }
  };

  const isWeb = Platform.OS === 'web';

  return (
    <View
      style={[
        styles.container,
        isWeb ? styles.webFixed : styles.nativeFixed,
        {
          paddingBottom: Math.max(safeAreaInsets.bottom, 10),
          backgroundColor: '#ffffff',
          borderTopColor: '#f1f5f9',
        },
      ]}
    >
      <View style={styles.content}>
        {NAV_ITEMS.map((item) => {
          const active = item.isActive(pathname);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePress(item)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: active }}
              style={styles.tabButton}
            >
              {active && <View style={styles.activeBar} />}

              <View style={styles.iconContainer}>
                <Image
                  source={active ? item.activeIcon : item.icon}
                  style={styles.icon}
                  contentFit="contain"
                />
              </View>

              <Text
                style={[
                  styles.label,
                  active ? styles.labelActive : styles.labelInactive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    zIndex: 9999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 12,
  },
  webFixed: {
    // @ts-ignore - position fixed is supported in react-native-web
    position: 'fixed',
  },
  nativeFixed: {
    position: 'absolute',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  activeBar: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#3563E9',
  },
  iconContainer: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 22,
    height: 22,
  },
  label: {
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  labelActive: {
    color: '#3563E9',
    fontWeight: '700',
  },
  labelInactive: {
    color: '#90A3BF',
    fontWeight: '500',
  },
});
