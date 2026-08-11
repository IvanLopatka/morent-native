import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CarService, Car } from '@/lib/car-service';

export function Sidebar() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const [cars, setCars] = useState<Car[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await CarService.getAllCars();
        setCars(data);
      } catch (err) {
        console.error('Error fetching cars in Sidebar:', err);
      }
    };
    fetchCars();
  }, []);

  const selectedTypes = (searchParams.type as string)?.split(',').filter(Boolean) || [];
  const selectedCapacities = (searchParams.capacity as string)?.split(',').filter(Boolean) || [];
  const maxPrice = parseInt((searchParams.price as string) || '500');

  const updateFilters = (key: string, value: string, checked: boolean) => {
    let currentValues = [...(key === 'type' ? selectedTypes : selectedCapacities)];
    if (checked) {
      if (!currentValues.includes(value)) {
        currentValues.push(value);
      }
    } else {
      currentValues = currentValues.filter((v) => v !== value);
    }
    router.setParams({ [key]: currentValues.join(',') });
  };

  const handlePriceChange = (price: number) => {
    router.setParams({ price: price.toString() });
  };

  const types = [
    { id: 'sport', label: 'Sport', value: 'Sportscar' },
    { id: 'suv', label: 'SUV', value: 'SUV' },
    { id: 'mpv', label: 'MPV', value: 'MPV' },
    { id: 'sedan', label: 'Sedan', value: 'Sedan' },
    { id: 'coupe', label: 'Coupe', value: 'Coupe' },
    { id: 'hatchback', label: 'Hatchback', value: 'Hatchback' },
  ];

  const capacities = [
    { id: '2-person', label: '2 Person', value: '2' },
    { id: '4-person', label: '4 Person', value: '4' },
    { id: '6-person', label: '6 Person', value: '6' },
    { id: '8-or-more', label: '8 or More', value: '8' },
  ];

  return (
    <ScrollView className="w-[280px] border-r border-gray-100 bg-white p-6 h-full">
      <View className="mb-8">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Type</Text>
        <View className="gap-3">
          {types.map((type) => {
            const isChecked = selectedTypes.includes(type.value);
            const count = cars.filter((car) => car.type === type.value).length;
            return (
              <TouchableOpacity
                key={type.id}
                onPress={() => updateFilters('type', type.value, !isChecked)}
                className="flex-row items-center gap-3"
              >
                <View className={`w-5 h-5 rounded border items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                  {isChecked && <Text className="text-white text-xs font-bold">✓</Text>}
                </View>
                <Text className="text-sm font-semibold text-gray-600">{type.label}</Text>
                <Text className="text-sm font-semibold text-gray-400">({count})</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Capacity</Text>
        <View className="gap-3">
          {capacities.map((cap) => {
            const isChecked = selectedCapacities.includes(cap.value);
            const count = cars.filter((car) => {
              if (cap.value === '8') return parseInt(car.seats) >= 8;
              return car.seats === cap.value;
            }).length;
            return (
              <TouchableOpacity
                key={cap.id}
                onPress={() => updateFilters('capacity', cap.value, !isChecked)}
                className="flex-row items-center gap-3"
              >
                <View className={`w-5 h-5 rounded border items-center justify-center ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                  {isChecked && <Text className="text-white text-xs font-bold">✓</Text>}
                </View>
                <Text className="text-sm font-semibold text-gray-600">{cap.label}</Text>
                <Text className="text-sm font-semibold text-gray-400">({count})</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Price</Text>
        <View className="gap-2">
          {/* Simple Touch-to-select Price points instead of heavy gestures */}
          <View className="flex-row justify-between gap-1 flex-wrap">
            {[100, 200, 300, 400, 500].map((pricePoint) => {
              const isActive = maxPrice === pricePoint;
              return (
                <TouchableOpacity
                  key={pricePoint}
                  onPress={() => handlePriceChange(pricePoint)}
                  className={`px-3 py-1.5 rounded-lg border ${isActive ? 'bg-blue-600 border-blue-600' : 'border-gray-200 bg-white'}`}
                >
                  <Text className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                    ${pricePoint}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text className="text-sm font-semibold text-gray-600 mt-2">
            Max. ${maxPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
