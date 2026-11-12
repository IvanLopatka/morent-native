import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useNavigationHeader } from '@/hooks/use-navigation-header';
import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/utils/supabase/client';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const safeAreaInsets = useSafeAreaInsets();
  const headerOptions = useNavigationHeader();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    name?: string;
    avatarUrl?: string | null;
  } | null>(null);

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [currency, setCurrency] = useState('USD ($)');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              'Morent Member',
            avatarUrl:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              null,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name:
              session.user.user_metadata?.full_name ||
              session.user.user_metadata?.name ||
              'Morent Member',
            avatarUrl:
              session.user.user_metadata?.avatar_url ||
              session.user.user_metadata?.picture ||
              null,
          });
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Error signing out:', err);
    } finally {
      setIsSigningOut(false);
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

  return (
    <>
      <Stack.Screen options={headerOptions} />
      <ScrollView
        removeClippedSubviews={false}
        style={{ flex: 1, backgroundColor: theme.background }}
        contentContainerStyle={[
          {
            paddingBottom:
              safeAreaInsets.bottom + BottomTabInset + Spacing.four,
            alignItems: 'center',
          },
          contentPlatformStyle,
        ]}
      >
        <View
          style={{ width: '100%', maxWidth: MaxContentWidth }}
          className="px-6 py-4"
        >
          {/* Page Title */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">Settings</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Manage your application preferences and account options
            </Text>
          </View>

          {/* Account Section */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 shadow-sm">
            <Text className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">
              Account
            </Text>

            {isLoading ? (
              <ActivityIndicator size="small" color="#3563E9" />
            ) : user ? (
              <View>
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                    {user.avatarUrl ? (
                      <Image
                        source={{ uri: user.avatarUrl }}
                        className="w-full h-full"
                        contentFit="cover"
                      />
                    ) : (
                      <View className="w-full h-full items-center justify-center bg-blue-600">
                        <Text className="text-white text-lg font-bold">
                          {user.name?.charAt(0) || 'U'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900">
                      {user.name}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                      {user.email}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-3 pt-3 border-t border-gray-100">
                  <TouchableOpacity
                    onPress={() => router.push('/profile' as any)}
                    className="flex-1 bg-blue-50 py-3 rounded-xl items-center"
                  >
                    <Text className="text-blue-600 font-semibold text-xs">
                      View Profile
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleSignOut}
                    disabled={isSigningOut}
                    className="px-5 bg-red-50 py-3 rounded-xl items-center"
                  >
                    <Text className="text-red-600 font-semibold text-xs">
                      {isSigningOut ? 'Signing out...' : 'Sign Out'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-base font-bold text-gray-900">
                    Not Signed In
                  </Text>
                  <Text className="text-xs text-gray-500 mt-0.5">
                    Sign in to rent cars and save your favorites
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => router.push('/auth' as any)}
                  className="bg-blue-600 px-5 py-2.5 rounded-xl"
                >
                  <Text className="text-white font-bold text-xs">Sign In</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Preferences Section */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 mb-6 shadow-sm gap-5">
            <Text className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
              Preferences
            </Text>

            {/* Notifications Switch */}
            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold text-gray-800">
                  Push Notifications
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Receive notifications on rental updates and offers
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}

                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={notificationsEnabled ? '#2563eb' : '#f3f4f6'}
              />
            </View>

            {/* Email Alerts Switch */}
            <View className="flex-row justify-between items-center border-t border-gray-100 pt-4">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold text-gray-800">
                  Email Alerts
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Receive receipts, booking confirmations and invoices
                </Text>
              </View>
              <Switch
                value={emailAlertsEnabled}
                onValueChange={setEmailAlertsEnabled}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={emailAlertsEnabled ? '#2563eb' : '#f3f4f6'}
              />
            </View>

            {/* Location Switch */}
            <View className="flex-row justify-between items-center border-t border-gray-100 pt-4">
              <View className="flex-1 pr-4">
                <Text className="text-sm font-semibold text-gray-800">
                  Location Services
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Suggest nearby car pickup locations
                </Text>
              </View>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
                thumbColor={locationEnabled ? '#2563eb' : '#f3f4f6'}
              />
            </View>

            {/* Currency Selector */}
            <View className="flex-row justify-between items-center border-t border-gray-100 pt-4">
              <View>
                <Text className="text-sm font-semibold text-gray-800">
                  Currency
                </Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  Display prices in selected currency
                </Text>
              </View>
              <View className="flex-row gap-2">
                {['USD ($)', 'EUR (€)', 'GBP (£)'].map((curr) => (
                  <TouchableOpacity
                    key={curr}
                    onPress={() => setCurrency(curr)}
                    className={`px-3 py-1.5 rounded-lg border ${currency === curr
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-gray-50 border-gray-200'
                      }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${currency === curr ? 'text-white' : 'text-gray-700'
                        }`}
                    >
                      {curr.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* About & Support Section */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm gap-4 mb-6">
            <Text className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-1">
              About & Legal
            </Text>

            <View className="flex-row justify-between items-center py-1">
              <Text className="text-sm text-gray-700">App Version</Text>
              <Text className="text-xs font-semibold text-gray-400">1.0.0</Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push('/catalog' as any)}
              className="flex-row justify-between items-center py-2 border-t border-gray-100"
            >
              <Text className="text-sm text-gray-700">Browse Cars</Text>
              <Text className="text-xs text-blue-600 font-semibold">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/' as any)}
              className="flex-row justify-between items-center py-2 border-t border-gray-100"
            >
              <Text className="text-sm text-gray-700">Terms of Service</Text>
              <Text className="text-xs text-blue-600 font-semibold">→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/' as any)}
              className="flex-row justify-between items-center py-2 border-t border-gray-100"
            >
              <Text className="text-sm text-gray-700">Privacy Policy</Text>
              <Text className="text-xs text-blue-600 font-semibold">→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

