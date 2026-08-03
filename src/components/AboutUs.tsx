import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';

export function AboutUs() {
  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  return (
    <View className="w-full bg-white pt-12 pb-8 px-6 border-t border-gray-100">
      <View className="gap-8">
        {/* Brand Section */}
        <View className="gap-3">
          <Text className="text-2xl font-bold text-blue-500">MORENT</Text>
          <Text className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
            Our vision is to provide convenience and help increase your sales business.
          </Text>
        </View>

        {/* Links Grid */}
        <View className="flex-row flex-wrap justify-between gap-y-8">
          {/* About Column */}
          <View className="w-[45%]">
            <Text className="text-base font-bold text-gray-900 mb-4">About</Text>
            <View className="gap-3">
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">How it works</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Featured</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Partnership</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Business Relation</Text></TouchableOpacity>
            </View>
          </View>

          {/* Community Column */}
          <View className="w-[45%]">
            <Text className="text-base font-bold text-gray-900 mb-4">Community</Text>
            <View className="gap-3">
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Events</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Blog</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Podcast</Text></TouchableOpacity>
              <TouchableOpacity><Text className="text-gray-500 text-sm font-medium">Invite a friend</Text></TouchableOpacity>
            </View>
          </View>

          {/* Socials Column */}
          <View className="w-[45%]">
            <Text className="text-base font-bold text-gray-900 mb-4">Socials</Text>
            <View className="gap-3">
              <TouchableOpacity onPress={() => handleOpenLink('https://discord.com')}>
                <Text className="text-gray-500 text-sm font-medium">Discord</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOpenLink('https://instagram.com')}>
                <Text className="text-gray-500 text-sm font-medium">Instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOpenLink('https://twitter.com')}>
                <Text className="text-gray-500 text-sm font-medium">Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleOpenLink('https://facebook.com')}>
                <Text className="text-gray-500 text-sm font-medium">Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Copyright/Privacy */}
      <View className="border-t border-gray-100 mt-10 pt-6 flex-col gap-4">
        <Text className="text-gray-800 text-xs font-semibold">©2022 MORENT. All rights reserved</Text>
        <View className="flex-row gap-6">
          <TouchableOpacity><Text className="text-gray-800 text-xs font-semibold">Privacy & Policy</Text></TouchableOpacity>
          <TouchableOpacity><Text className="text-gray-800 text-xs font-semibold">Terms & Condition</Text></TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
