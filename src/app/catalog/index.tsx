import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

import { AboutUs } from '@/components/AboutUs';
import { CompareCars } from '@/components/CompareCars';
import { MobileSearch } from '@/components/MobileSearch';
import { RecommendationCar } from '@/components/RecommendationCar';
import { Sidebar } from '@/components/Sidebar';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useNavigationHeader } from '@/hooks/use-navigation-header';
import { useTheme } from '@/hooks/use-theme';

export default function CatalogScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const headerOptions = useNavigationHeader();
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
        <View style={{ width: '100%', maxWidth: MaxContentWidth }}>
          {/* Search and Filters Bar */}
          <View className="px-6 mb-4 mt-2 flex-row justify-between items-center">
            <MobileSearch />
            {!isDesktop && (
              <TouchableOpacity
                onPress={() => setShowMobileFilters(!showMobileFilters)}
                className="bg-blue-600 px-4 py-2.5 rounded-xl ml-3"
              >
                <Text className="text-white font-bold text-xs">
                  {showMobileFilters ? 'Hide Filters' : 'Filters'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-row items-start w-full">
            {/* Sidebar Layout */}
            {(isDesktop || (!isDesktop && showMobileFilters)) && (
              <View
                className={
                  isDesktop
                    ? 'w-[280px]'
                    : 'absolute top-0 left-6 z-50 shadow-lg rounded-2xl bg-white border border-gray-200 h-[80vh] overflow-hidden'
                }
              >
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
    </>
  );
}
