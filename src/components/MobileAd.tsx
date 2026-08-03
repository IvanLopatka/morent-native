import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';

export function MobileAd() {
  return (
    <View className="px-6 mb-6">
      <ImageBackground
        source={require('@/assets/images/mobile-ad.png')}
        style={{ height: 200, width: '100%' }}
        imageStyle={{ borderRadius: 16 }}
        resizeMode="cover"
      >
        <View className="flex-1 justify-between p-5 bg-black/10 rounded-2xl">
          <View className="gap-2">
            <Text className="text-white text-lg font-bold leading-tight max-w-[200px]">
              The Best Platform for Car Rental
            </Text>
            <Text className="text-white/80 text-xs max-w-[220px]">
              Providing cheap car rental services and safe and comfortable facilities.
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-600 self-start px-4 py-2.5 rounded-lg">
            <Text className="text-white font-bold text-sm">Rental Car</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
