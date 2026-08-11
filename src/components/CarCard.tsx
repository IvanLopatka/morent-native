import { CarService } from '@/lib/car-service';
import { supabase } from '@/utils/supabase/client';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CarCardProps {
  id: string;
  name: string;
  type: string;
  image: string;
  price: string;
  seats: string;
  spending: string;
  className?: string;
}

export function CarCard({
  id,
  name,
  type,
  image,
  price,
  seats,
  spending,
  className = '',
}: CarCardProps) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        const status = await CarService.isCarSaved(id, session.user.id);
        setIsLiked(status);
      }
    };
    fetchUserAndStatus();
  }, [id]);

  const handleLike = async () => {
    if (!userId) {
      alert("Please login to save cars!");
      return;
    }
    const { saved } = await CarService.toggleSaveCar(id, userId);
    setIsLiked(saved);
  };

  const handleRentNow = () => {
    router.push(`/catalog/${id}` as any);
  };

  return (
    <View className={`w-[260px] md:w-[280px] bg-white rounded-2xl p-4 justify-between border border-gray-100 shadow-sm ${className}`}>
      {/* Header */}
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-bold text-gray-900">{name}</Text>
          <Text className="text-sm font-semibold text-gray-400 mt-0.5">{type}</Text>
        </View>
        <TouchableOpacity onPress={handleLike} className="p-1">
          <Image
            source={isLiked ? require('@/assets/images/red-like.svg') : require('@/assets/images/hollow-like.svg')}
            style={{ width: 24, height: 24 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Image Container */}
      <View className="h-32 my-4 items-center justify-center">
        <Image
          source={{ uri: image }}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
        />
      </View>

      {/* Info specs */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-row items-center gap-1">
          <Image source={require('@/assets/images/gas-station.svg')} style={{ width: 18, height: 18 }} />
          <Text className="text-xs font-semibold text-gray-400">{spending}L</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Image source={require('@/assets/images/helm.svg')} style={{ width: 18, height: 18 }} />
          <Text className="text-xs font-semibold text-gray-400">Manual</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Image source={require('@/assets/images/profile-2user.svg')} style={{ width: 18, height: 18 }} />
          <Text className="text-xs font-semibold text-gray-400">{seats} People</Text>
        </View>
      </View>

      {/* Footer */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-gray-900">${price}/</Text>
          <Text className="text-xs font-semibold text-gray-400">day</Text>
        </View>
        <TouchableOpacity
          onPress={handleRentNow}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-bold text-sm">Rent Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
