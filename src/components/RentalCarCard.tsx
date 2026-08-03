import { useRouter } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export function RentalCarCard() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push('/explore' as any);
  };

  return (
    <View className="px-6 mb-6 flex-col md:flex-row gap-4">
      {/* Left Ad */}
      <View className="flex-1 rounded-2xl overflow-hidden">
        <ImageBackground
          source={require('@/assets/images/left-ad.png')}
          style={{ height: 240 }}
          resizeMode="cover"
        >
          <View className="flex-1 justify-between p-6 bg-black/15">
            <View className="gap-2">
              <Text className="text-white text-xl font-bold leading-tight max-w-[200px]">
                The Best Platform for Car Rental
              </Text>
              <Text className="text-white/80 text-sm max-w-[220px]">
                Ease of doing a car rental safely and reliably. Of course at a low price.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNavigate}
              className="bg-blue-600 self-start px-5 py-2.5 rounded-lg"
            >
              <Text className="text-white font-bold text-sm">Rental Car</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      {/* Right Ad */}
      <View className="flex-1 rounded-2xl overflow-hidden">
        <ImageBackground
          source={require('@/assets/images/right-ad.png')}
          style={{ height: 240 }}
          resizeMode="cover"
        >
          <View className="flex-1 justify-between p-6 bg-black/15">
            <View className="gap-2">
              <Text className="text-white text-xl font-bold leading-tight max-w-[200px]">
                Easy way to rent a car at a low price
              </Text>
              <Text className="text-white/80 text-sm max-w-[220px]">
                Providing cheap car rental services and safe and comfortable facilities.
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleNavigate}
              className="bg-blue-400 self-start px-5 py-2.5 rounded-lg"
            >
              <Text className="text-white font-bold text-sm">Rental Car</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
