import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CarService, Car } from '@/lib/car-service';
import { CarCard } from './CarCard';

export function PopularCar() {
  const router = useRouter();
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
        console.error('Error fetching popular cars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, [searchParams]);

  if (isLoading) {
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  }

  if (cars.length === 0) return null;

  return (
    <View className="px-6 mb-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-gray-400 font-bold text-sm">Popular Car</Text>
        <TouchableOpacity onPress={() => router.push('/explore' as any)}>
          <Text className="text-blue-600 font-bold text-sm">View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cars.slice(0, 6)}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: 16 }}
        renderItem={({ item }) => (
          <CarCard
            id={item.id}
            name={item.name}
            type={item.type}
            image={item.thumbnail}
            price={item.price}
            seats={item.seats}
            spending={item.spending}
          />
        )}
      />
    </View>
  );
}
