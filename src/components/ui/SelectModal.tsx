import React from 'react';
import { FlatList, Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

interface SelectModalProps {
  visible: boolean;
  onClose: () => void;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  title: string;
}

export function SelectModal({
  visible,
  onClose,
  options,
  selectedValue,
  onSelect,
  title,
}: SelectModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end bg-black/50">
        <SafeAreaView className="bg-white rounded-t-3xl max-h-[50%]">
          <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-black">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600 font-semibold text-base">Done</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${selectedValue === item ? 'bg-blue-50' : ''
                  }`}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text
                  className={`text-base ${selectedValue === item ? 'font-bold text-blue-600' : 'text-gray-700'
                    }`}
                >
                  {item}
                </Text>
                {selectedValue === item && (
                  <Text className="text-blue-600 font-bold text-base">✓</Text>
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}
