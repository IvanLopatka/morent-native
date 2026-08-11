import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AboutUs } from '@/components/AboutUs';
import { CarInfo } from '@/components/CarInfo';
import { MobileSearch } from '@/components/MobileSearch';
import { NavigationBar } from '@/components/NavigationBar';
import { Reviews } from '@/components/Reviews';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Car, CarService } from '@/lib/car-service';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams();
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchCar = async () => {
      setIsLoading(true);
      try {
        const data = await CarService.getCarById(id as string);
        setCar(data);
      } catch (err) {
        console.error('Error fetching car details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{
        paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.four,
        alignItems: 'center',
        paddingTop: safeAreaInsets.top + Spacing.two,
      }}
    >
      <View style={{ width: '100%', maxWidth: MaxContentWidth }} className="px-6">
        <NavigationBar />
        <View className="my-4">
          <MobileSearch />
        </View>

        {isLoading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        ) : !car ? (
          <View className="py-20 items-center justify-center">
            <Text className="text-gray-500 font-medium">Car details not found.</Text>
          </View>
        ) : (
          <View>
            <CarInfo id={id as string} car={car} />
            <Reviews />
          </View>
        )}

        <AboutUs />
      </View>
    </ScrollView>
  );
}
