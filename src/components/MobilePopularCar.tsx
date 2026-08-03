import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { CarService, Car } from '@/lib/car-service';
import { CarCard } from './CarCard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;

export function MobilePopularCar() {
  const searchParams = useLocalSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const pickUpLocation = (searchParams.pickUpLocation as string) || undefined;
        const data = await CarService.getAllCars({
          types: (searchParams.type as string)?.split(',') || [],
          capacities: (searchParams.capacity as string)?.split(',') || [],
          maxPrice: parseInt((searchParams.price as string) || '500'),
          pickUpDate: (searchParams.pickUpDate as string) || undefined,
          dropOffDate: (searchParams.dropOffDate as string) || undefined,
          pickUpTime: (searchParams.pickUpTime as string) || undefined,
          dropOffTime: (searchParams.dropOffTime as string) || undefined,
          pickUpLocation,
          search: (searchParams.search as string) || undefined,
        });
        setCars(data);
      } catch (error) {
        console.error('Error fetching mobile popular cars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, [searchParams]);

  if (isLoading) {
    return (
      <View className="py-4 items-center justify-center">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  }

  if (cars.length === 0) return null;

  return (
    <View className="mb-6">
      <FlatList
        data={cars.slice(0, 4)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarCard
            id={item.id}
            name={item.name}
            type={item.type}
            image={item.thumbnail}
            price={item.price}
            seats={item.seats}
            spending={item.spending}
            className="w-[260px]"
          />
        )}
      />
    </View>
  );
}
