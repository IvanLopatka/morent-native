import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CarService, Car } from '@/lib/car-service';

export function MobileSearch() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const searchParam = (params.search as string) || '';

  const [searchVal, setSearchVal] = useState(searchParam);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setSearchVal(searchParam);
  }, [searchParam]);

  // Debounced search for query updating
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchVal.trim() === searchParam) return;
      router.setParams({ search: searchVal.trim() });
    }, 400);

    return () => clearTimeout(handler);
  }, [searchVal]);

  // Fetch live search results for suggestion dropdown
  useEffect(() => {
    if (!searchVal.trim()) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const results = await CarService.getAllCars({ search: searchVal });
        setSearchResults(results);
      } catch (err) {
        console.error("Error searching cars on native mobile:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const handler = setTimeout(fetchResults, 300);
    return () => clearTimeout(handler);
  }, [searchVal]);

  const handleSelectItem = (carId: string) => {
    setIsFocused(false);
    router.push(`/explore?id=${carId}` as any);
  };

  return (
    <View className="w-full px-6 mb-6 z-50">
      <View className="flex-row items-center gap-3">
        {/* Input Bar */}
        <View className="flex-1 bg-white border border-gray-200 rounded-2xl flex-row items-center px-4 py-2.5 h-12 shadow-sm">
          <Image
            source={require('@/assets/images/search.svg')}
            style={{ width: 20, height: 20, marginRight: 8 }}
          />
          <TextInput
            className="flex-1 text-base text-gray-800 p-0"
            placeholder="Search something here"
            value={searchVal}
            onChangeText={setSearchVal}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Filter Button */}
        <TouchableOpacity className="w-12 h-12 border border-gray-200 bg-white rounded-2xl items-center justify-center shadow-sm">
          <Image
            source={require('@/assets/images/filter.svg')}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>
      </View>

      {/* Suggestion Dropdown */}
      {isFocused && searchVal.trim().length > 0 && (
        <View className="absolute top-14 left-6 right-6 bg-white border border-gray-100 rounded-2xl shadow-lg mt-1 p-2 max-h-60 z-50 overflow-hidden">
          {isSearching ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator size="small" color="#2563eb" />
            </View>
          ) : searchResults.length === 0 ? (
            <View className="py-4 items-center">
              <Text className="text-gray-400 text-sm">No cars found</Text>
            </View>
          ) : (
            <FlatList
              data={searchResults.slice(0, 5)}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectItem(item.id)}
                  className="flex-row items-center justify-between p-3 border-b border-gray-50 active:bg-gray-50"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Image
                      source={{ uri: item.thumbnail }}
                      style={{ width: 44, height: 32 }}
                      contentFit="contain"
                    />
                    <View className="flex-1">
                      <Text className="font-bold text-sm text-gray-800 truncate">{item.name}</Text>
                      <Text className="text-[10px] text-gray-400 capitalize">{item.type}</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-sm text-gray-900">${item.price}</Text>
                    <Text className="text-[9px] text-gray-400">/day</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}
