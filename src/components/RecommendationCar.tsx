import { Car, CarService } from '@/lib/car-service';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { CarCard } from './CarCard';

export function RecommendationCar() {
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
        console.error('Error fetching recommended cars:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCars();
  }, [JSON.stringify(searchParams)]);

  if (isLoading && cars.length === 0) {
    return (
      <View className="py-8 items-center justify-center">
        <ActivityIndicator size="small" color="#2563eb" />
      </View>
    );
  }

  const handleShowMore = () => {
    router.push('/explore' as any);
  };

  return (
    <View className={`px-6 mb-8 mt-4 ${isLoading ? 'opacity-60' : ''}`}>
      <View className="flex-row justify-between items-center mb-5">
        <Text className="text-gray-400 font-bold text-sm">Recommendation Car</Text>
      </View>

      {cars.length === 0 ? (
        <View className="flex-col items-center justify-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Text className="text-gray-500 font-medium">No cars found matching filters.</Text>
          <TouchableOpacity onPress={() => router.push('/explore' as any)} className="mt-2">
            <Text className="text-blue-600 font-bold">Clear all filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-col md:flex-row md:flex-wrap justify-center items-center gap-4">
          {cars.slice(0, 8).map((car) => (
            <CarCard
              key={car.id}
              id={car.id}
              name={car.name}
              type={car.type}
              image={car.thumbnail}
              price={car.price}
              seats={car.seats}
              spending={car.spending}
              className="w-full md:w-[48%] xl:w-[23%]"
            />
          ))}
        </View>
      )}

      {cars.length > 0 && (
        <View className="flex-row items-center justify-center mt-10 relative h-12 w-full">
          <TouchableOpacity
            onPress={handleShowMore}
            className="bg-blue-600 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-bold text-sm">Show more cars</Text>
          </TouchableOpacity>
          <Text className="absolute right-0 text-xs font-semibold text-gray-400">
            {cars.length} cars
          </Text>
        </View>
      )}
    </View>
  );
}
