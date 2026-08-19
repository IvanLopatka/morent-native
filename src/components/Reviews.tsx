import { Reviews as ReviewsData } from '@/lib/reviews-data';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function Reviews() {
  const [showAll, setShowAll] = useState(false);
  const visibleReviews = showAll ? ReviewsData : ReviewsData.slice(0, 2);
  const Stars = [1, 2, 3, 4, 5];

  return (
    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-6">
        <Text className="text-lg font-bold text-gray-900">Reviews</Text>
        <View className="bg-blue-600 px-2.5 py-1 rounded-lg">
          <Text className="text-white text-xs font-bold">{ReviewsData.length}</Text>
        </View>
      </View>

      {/* Reviews List */}
      <View className="gap-6">
        {visibleReviews.map((review) => (
          <View key={review.id} className="border-b border-gray-50 pb-5 last:border-b-0">
            {/* Header info */}
            <View className="flex-row items-start gap-3 mb-3">
              <Image
                source={require('@/assets/images/profile-2user.svg')}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#f3f4f6' }}
              />
              <View className="flex-1">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-sm font-bold text-gray-900">{review.name}</Text>
                    <Text className="text-xs text-gray-400 font-medium">{review.position}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-gray-400 mb-1">{review.date}</Text>
                    {/* Stars */}
                    <View className="flex-row gap-0.5">
                      {Stars.map((star, idx) => (
                        <Image
                          key={star}
                          source={idx < review.rating ? require('@/assets/images/active-rate-star.svg') : require('@/assets/images/passive-rate-star.svg')}
                          style={{ width: 12, height: 12 }}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Comment */}
            <Text className="text-xs leading-relaxed text-gray-500 pl-14">
              {review.comment}
            </Text>
          </View>
        ))}
      </View>

      {/* Toggle button */}
      {ReviewsData.length > 2 && (
        <TouchableOpacity
          onPress={() => setShowAll(!showAll)}
          className="mt-4 py-2 items-center justify-center rounded-xl bg-gray-50 border border-gray-100"
        >
          <Text className="text-sm font-bold text-gray-500">
            {showAll ? 'Show less' : `Show all (${ReviewsData.length - 2} more)`}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
