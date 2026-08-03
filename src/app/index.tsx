import React from 'react';
import { ScrollView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MobileSearch } from '@/components/MobileSearch';
import { RentalCarCard } from '@/components/RentalCarCard';
import { MobileAd } from '@/components/MobileAd';
import { CompareCars } from '@/components/CompareCars';
import { PopularCar } from '@/components/PopularCar';
import { RecommendationCar } from '@/components/RecommendationCar';
import { AboutUs } from '@/components/AboutUs';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

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
        <MobileSearch />
        <RentalCarCard />
        <MobileAd />
        <CompareCars />
        <PopularCar />
        <RecommendationCar />
        <AboutUs />
      </View>
    </ScrollView>
  );
}
