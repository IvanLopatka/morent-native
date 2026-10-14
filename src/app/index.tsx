import { AboutUs } from '@/components/AboutUs';
import { CompareCars } from '@/components/CompareCars';
import { MobileSearch } from '@/components/MobileSearch';
import { PopularCar } from '@/components/PopularCar';
import { RecommendationCar } from '@/components/RecommendationCar';
import { RentalCarCard } from '@/components/RentalCarCard';
import {
  BottomTabInset,
  MaxContentWidth,
  Spacing,
} from '@/constants/theme';
import { useNavigationHeader } from '@/hooks/use-navigation-header';
import { useTheme } from '@/hooks/use-theme';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const headerOptions = useNavigationHeader();

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
        style={{
          flex: 1,
          backgroundColor: theme.background,
        }}
        contentContainerStyle={[
          {
            paddingBottom:
              safeAreaInsets.bottom +
              BottomTabInset +
              Spacing.four,
            alignItems: 'center',
          },
          contentPlatformStyle,
        ]}
      >
        <View
          style={{
            width: '100%',
            maxWidth: MaxContentWidth,
          }}
        >
          <MobileSearch />
          <RentalCarCard />
          <CompareCars />
          <PopularCar />
          <RecommendationCar />
          <AboutUs />
        </View>
      </ScrollView>
    </>
  );
}
