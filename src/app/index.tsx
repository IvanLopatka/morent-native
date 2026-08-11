import { AboutUs } from '@/components/AboutUs';
import { CompareCars } from '@/components/CompareCars';
import { MobileSearch } from '@/components/MobileSearch';
import { NavigationBar } from '@/components/NavigationBar';
import { PopularCar } from '@/components/PopularCar';
import { RecommendationCar } from '@/components/RecommendationCar';
import { RentalCarCard } from '@/components/RentalCarCard';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
        <NavigationBar />
        <MobileSearch />
        <RentalCarCard />
        <CompareCars />
        <PopularCar />
        <RecommendationCar />
        <AboutUs />
      </View>
    </ScrollView>
  );
}
