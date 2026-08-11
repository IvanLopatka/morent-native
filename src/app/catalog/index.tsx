import React, { useState } from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutUs } from '@/components/AboutUs';
import { CompareCars } from '@/components/CompareCars';
import { MobileSearch } from '@/components/MobileSearch';
import { NavigationBar } from '@/components/NavigationBar';
import { RecommendationCar } from '@/components/RecommendationCar';
import { Sidebar } from '@/components/Sidebar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function CatalogScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isDesktop = Platform.OS === 'web' && width > 768;

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
    <ScrollView
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

        {/* Mobile Filter Toggle Button */}
        {!isDesktop && (
          <View className="px-6 mb-2 mt-4 flex-row justify-between items-center">
            <MobileSearch />
            <TouchableOpacity
              onPress={() => setShowMobileFilters(!showMobileFilters)}
              className="bg-blue-600 px-4 py-2.5 rounded-xl ml-3"
            >
              <Text className="text-white font-bold text-xs">
                {showMobileFilters ? 'Hide Filters' : 'Filters'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row items-start w-full">
          {/* Sidebar Layout */}
          {(isDesktop || (!isDesktop && showMobileFilters)) && (
            <View className={isDesktop ? 'w-[280px]' : 'absolute top-16 left-6 z-50 shadow-lg rounded-2xl bg-white border border-gray-200 h-[80vh] overflow-hidden'}>
              <Sidebar />
            </View>
          )}

          {/* Main Content */}
          <View className="flex-1">
            <CompareCars />
            <RecommendationCar />
          </View>
        </View>

        <AboutUs />
      </View>
    </ScrollView>
  );
}
