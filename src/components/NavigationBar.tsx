import { useTheme } from '@/hooks/use-theme';
import { supabase } from '@/utils/supabase/client';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export function NavigationBar() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const searchParam = (params.search as string) || '';
  const [searchVal, setSearchVal] = useState(searchParam);
  const theme = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  console.log(" Outer sAuthenticated", isAuthenticated);

  const handleAuthProfilePress = () => {
    console.log("isAuthenticated", isAuthenticated);

    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/auth/AuthModal');
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setAvatarUrl(session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setAvatarUrl(session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSearch = (val: string) => {
    setSearchVal(val);
    // Debounce or update route params
    router.setParams({ search: val.trim() });
  };

  return (
    <View
      className="w-full border-b border-gray-100 bg-white py-4 px-6 md:px-16 flex-row items-center justify-between z-50"
      style={{ borderBottomColor: theme.backgroundElement }}
    >
      {/* Left Section: Brand Logo */}
      <View className="flex-row items-center gap-16">
        <TouchableOpacity onPress={() => router.push('/' as any)}>
          <Text className="text-[#3563E9] text-2xl font-bold tracking-tight">
            MORENT
          </Text>
        </TouchableOpacity>

        {/* Middle Section: Search Bar (Hidden on smaller screens, shown on md and up) */}
        <View className="hidden md:flex flex-row items-center bg-white border border-gray-200 rounded-full px-5 py-2.5 w-[492px] h-11 relative">
          <Image
            source={require('@/assets/images/search.svg')}
            className="w-5 h-5 mr-3 text-gray-500"
            tintColor="#596780"
          />
          <TextInput
            value={searchVal}
            onChangeText={handleSearch}
            placeholder="Search something here"
            placeholderTextColor="#596780"
            className="flex-1 text-sm font-medium text-[#596780] outline-none"
          />
          <TouchableOpacity className="absolute right-4">
            <Image
              source={require('@/assets/images/filter.svg')}
              className="w-5 h-5 text-gray-500"
              tintColor="#596780"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Section: Actions / Profile */}
      <View className="flex-row items-center gap-5">
        {/* Heart/Favorites Icon */}
        <TouchableOpacity className="w-11 h-11 border border-gray-200 rounded-full items-center justify-center hidden sm:flex">
          <Image
            source={require('@/assets/images/heart.svg')}
            className="w-6 h-6"
            tintColor="#596780"
          />
        </TouchableOpacity>

        {/* Notification Icon */}
        <TouchableOpacity className="w-11 h-11 border border-gray-200 rounded-full items-center justify-center relative hidden sm:flex">
          <Image
            source={require('@/assets/images/notification.svg')}
            className="w-6 h-6"
            tintColor="#596780"
          />
          {/* Notification Badge */}
          <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#FF483C] rounded-full border border-white" />
        </TouchableOpacity>

        {/* Settings Icon */}
        <TouchableOpacity className="w-11 h-11 border border-gray-200 rounded-full items-center justify-center hidden sm:flex">
          <Image
            source={require('@/assets/images/setting.svg')}
            className="w-6 h-6"
            tintColor="#596780"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAuthProfilePress}
          className="w-11 h-11 rounded-full overflow-hidden border border-gray-200 bg-gray-50 items-center justify-center"
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-full h-full"
              contentFit="cover"
            />
          ) : (
            <Image
              source={require('@/assets/images/profile.svg')}
              className="w-full h-full"
              contentFit="cover"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
