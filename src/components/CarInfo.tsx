import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Car } from '@/lib/car-service';

interface CarInfoProps {
  id: string;
  car?: Car | null;
}

export function CarInfo({ id, car }: CarInfoProps) {
  const router = useRouter();
  const images = car ? [car.thumbnail, ...(car.gallery || [])] : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(4); // Default rating
  const Stars = [1, 2, 3, 4, 5];

  if (!car) {
    return (
      <View className="p-6 bg-white rounded-2xl items-center justify-center">
        <Text className="text-gray-500 font-medium">Car details not found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-col gap-6 mb-6">
      {/* Gallery Section */}
      <View className="bg-blue-600 rounded-2xl p-6 relative overflow-hidden">
        {/* Background Decorative Circles/Assets */}
        <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500 rounded-full opacity-50" />
        <View className="absolute -left-10 -top-10 w-32 h-32 bg-blue-400 rounded-full opacity-30" />

        <View className="h-48 w-full justify-center items-center mb-6">
          {images.length > 0 && (
            <Image
              source={images[activeIndex]}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              transition={200}
            />
          )}
        </View>

        {/* Thumbnail Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {images.map((image, index) => {
            const isActive = activeIndex === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
                className={`w-20 h-16 rounded-xl overflow-hidden border-2 bg-white/10 ${isActive ? 'border-white' : 'border-transparent opacity-75'}`}
              >
                <Image
                  source={image}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Details Section */}
      <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-start mb-4">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-bold text-gray-900 mb-1">{car.name}</Text>
            
            {/* Stars Rating */}
            <View className="flex-row items-center gap-1">
              {Stars.map((star, idx) => (
                <TouchableOpacity key={star} onPress={() => setRating(idx + 1)}>
                  <Image
                    source={idx < rating ? require('@/assets/images/active-rate-star.svg') : require('@/assets/images/passive-rate-star.svg')}
                    style={{ width: 16, height: 16 }}
                  />
                </TouchableOpacity>
              ))}
              <Text className="text-xs font-semibold text-gray-400 ml-2">440+ Reviews</Text>
            </View>
          </View>

          {/* Favorite Heart Icon */}
          <TouchableOpacity
            onPress={() => setIsLiked(!isLiked)}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
          >
            <Image
              source={isLiked ? require('@/assets/images/red-like.svg') : require('@/assets/images/hollow-like.svg')}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
        </View>

        <Text className="text-sm leading-relaxed text-gray-500 mb-6">
          {car.description || 'NISMO has become the embodiment of Nissan\'s outstanding performance, inspired by the most demanding track.'}
        </Text>

        {/* Specs Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-4 mb-6">
          <View className="w-[48%] flex-row justify-between border-b border-gray-50 pb-2">
            <Text className="text-sm font-semibold text-gray-400">Type Car</Text>
            <Text className="text-sm font-bold text-gray-700">{car.type}</Text>
          </View>
          <View className="w-[48%] flex-row justify-between border-b border-gray-50 pb-2">
            <Text className="text-sm font-semibold text-gray-400">Capacity</Text>
            <Text className="text-sm font-bold text-gray-700">{car.seats} Person</Text>
          </View>
          <View className="w-[48%] flex-row justify-between border-b border-gray-50 pb-2">
            <Text className="text-sm font-semibold text-gray-400">Steering</Text>
            <Text className="text-sm font-bold text-gray-700">Manual</Text>
          </View>
          <View className="w-[48%] flex-row justify-between border-b border-gray-50 pb-2">
            <Text className="text-sm font-semibold text-gray-400">Gasoline</Text>
            <Text className="text-sm font-bold text-gray-700">{car.spending}L/day</Text>
          </View>
        </View>

        {/* Price & Action */}
        <View className="flex-row justify-between items-center pt-2">
          <View>
            <Text className="text-xl font-bold text-gray-900">${car.price}/ <Text className="text-xs font-semibold text-gray-400">day</Text></Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(`/payment/${id}` as any)}
            className="bg-blue-600 px-6 py-3.5 rounded-xl shadow-sm"
          >
            <Text className="text-white font-bold text-sm">Rent Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
