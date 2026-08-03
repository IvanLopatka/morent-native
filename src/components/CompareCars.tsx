import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getCities } from '@/lib/api';
import { SelectModal } from './ui/SelectModal';

export function CompareCars() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  // Selected values
  const [pickUpCity, setPickUpCity] = useState((searchParams.pickUpLocation as string) || '');
  const [pickUpDate, setPickUpDate] = useState((searchParams.pickUpDate as string) || '');
  const [pickUpTime, setPickUpTime] = useState((searchParams.pickUpTime as string) || '');

  const [dropOffCity, setDropOffCity] = useState((searchParams.dropOffLocation as string) || '');
  const [dropOffDate, setDropOffDate] = useState((searchParams.dropOffDate as string) || '');
  const [dropOffTime, setDropOffTime] = useState((searchParams.dropOffTime as string) || '');

  // Options
  const [cities, setCities] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>([]);

  // Modal control
  const [activeModal, setActiveModal] = useState<{
    type: 'pickUpCity' | 'pickUpDate' | 'pickUpTime' | 'dropOffCity' | 'dropOffDate' | 'dropOffTime';
    title: string;
    options: string[];
    selectedValue: string;
  } | null>(null);

  useEffect(() => {
    // Load cities
    getCities().then(setCities);

    // Generate next 14 days
    const days: string[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const formatted = d.toISOString().split('T')[0]; // YYYY-MM-DD
      days.push(formatted);
    }
    setDates(days);

    // Generate times
    const hours: string[] = [];
    for (let i = 0; i < 24; i++) {
      hours.push(`${String(i).padStart(2, '0')}:00`);
    }
    setTimes(hours);
  }, []);

  // Sync url updates
  useEffect(() => {
    setPickUpCity((searchParams.pickUpLocation as string) || '');
    setPickUpDate((searchParams.pickUpDate as string) || '');
    setPickUpTime((searchParams.pickUpTime as string) || '');
    setDropOffCity((searchParams.dropOffLocation as string) || '');
    setDropOffDate((searchParams.dropOffDate as string) || '');
    setDropOffTime((searchParams.dropOffTime as string) || '');
  }, [searchParams]);

  const updateParam = (key: string, value: string) => {
    router.setParams({ [key]: value });
  };

  const handleSwap = () => {
    const tempCity = pickUpCity;
    const tempDate = pickUpDate;
    const tempTime = pickUpTime;

    router.setParams({
      pickUpLocation: dropOffCity,
      pickUpDate: dropOffDate,
      pickUpTime: dropOffTime,
      dropOffLocation: tempCity,
      dropOffDate: tempDate,
      dropOffTime: tempTime,
    });
  };

  const handleClear = () => {
    router.setParams({
      pickUpLocation: '',
      pickUpDate: '',
      pickUpTime: '',
      dropOffLocation: '',
      dropOffDate: '',
      dropOffTime: '',
    });
  };

  return (
    <View className="px-6 mb-6 gap-4">
      {/* Pick Up Box */}
      <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm gap-3">
        <View className="flex-row items-center gap-2">
          <Image source={require('@/assets/images/pick-up-mark.svg')} style={{ width: 16, height: 16 }} />
          <Text className="font-bold text-gray-900 text-sm">Pick - Up</Text>
        </View>
        <View className="flex-row justify-between">
          {/* Location */}
          <TouchableOpacity
            onPress={() =>
              setActiveModal({
                type: 'pickUpCity',
                title: 'Select Pick-Up Location',
                options: cities,
                selectedValue: pickUpCity,
              })
            }
            className="flex-1"
          >
            <Text className="font-bold text-gray-900 text-xs">Location</Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium truncate">
              {pickUpCity || 'Select city'}
            </Text>
          </TouchableOpacity>

          {/* Date */}
          <TouchableOpacity
            onPress={() =>
              setActiveModal({
                type: 'pickUpDate',
                title: 'Select Pick-Up Date',
                options: dates,
                selectedValue: pickUpDate,
              })
            }
            className="flex-1 border-l border-gray-100 pl-4"
          >
            <Text className="font-bold text-gray-900 text-xs">Date</Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              {pickUpDate || 'Select date'}
            </Text>
          </TouchableOpacity>

          {/* Time */}
          <TouchableOpacity
            onPress={() =>
              setActiveModal({
                type: 'pickUpTime',
                title: 'Select Pick-Up Time',
                options: times,
                selectedValue: pickUpTime,
              })
            }
            className="flex-1 border-l border-gray-100 pl-4"
          >
            <Text className="font-bold text-gray-900 text-xs">Time</Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              {pickUpTime || 'Select time'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons Row */}
      <View className="flex-row justify-center gap-4 items-center">
        <TouchableOpacity
          onPress={handleSwap}
          className="w-14 h-14 bg-blue-600 rounded-2xl items-center justify-center shadow-md"
        >
          <Image source={require('@/assets/images/swap.svg')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClear}
          className="bg-gray-100 px-4 py-2 rounded-xl"
        >
          <Text className="text-gray-600 font-bold text-xs">Clear Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Drop Off Box */}
      <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm gap-3">
        <View className="flex-row items-center gap-2">
          <Image source={require('@/assets/images/drop-off-mark.svg')} style={{ width: 16, height: 16 }} />
          <Text className="font-bold text-gray-900 text-sm">Drop - Off</Text>
        </View>
        <View className="flex-row justify-between">
          {/* Location */}
          <TouchableOpacity
            onPress={() =>
              setActiveModal({
                type: 'dropOffCity',
                title: 'Select Drop-Off Location',
                options: cities,
                selectedValue: dropOffCity,
              })
            }
            className="flex-1"
          >
            <Text className="font-bold text-gray-900 text-xs">Location</Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium truncate">
              {dropOffCity || 'Select city'}
            </Text>
          </TouchableOpacity>

          {/* Date */}
          <TouchableOpacity
            onPress={() =>
              setActiveModal({
                type: 'dropOffDate',
                title: 'Select Drop-Off Date',
                options: dates,
                selectedValue: dropOffDate,
              })
            }
            className="flex-1 border-l border-gray-100 pl-4"
          >
            <Text className="font-bold text-gray-900 text-xs">Date</Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              {dropOffDate || 'Select date'}
            </Text>
          </TouchableOpacity>

          {/* Time */}
          <TouchableOpacity
            onPress={() =>
              setActiveModal({
                type: 'dropOffTime',
                title: 'Select Drop-Off Time',
                options: times,
                selectedValue: dropOffTime,
              })
            }
            className="flex-1 border-l border-gray-100 pl-4"
          >
            <Text className="font-bold text-gray-900 text-xs">Time</Text>
            <Text className="text-gray-400 text-xs mt-1 font-medium">
              {dropOffTime || 'Select time'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Dialog */}
      {activeModal && (
        <SelectModal
          visible={true}
          title={activeModal.title}
          options={activeModal.options}
          selectedValue={activeModal.selectedValue}
          onClose={() => setActiveModal(null)}
          onSelect={(value) => {
            if (activeModal.type === 'pickUpCity') updateParam('pickUpLocation', value);
            else if (activeModal.type === 'pickUpDate') updateParam('pickUpDate', value);
            else if (activeModal.type === 'pickUpTime') updateParam('pickUpTime', value);
            else if (activeModal.type === 'dropOffCity') updateParam('dropOffLocation', value);
            else if (activeModal.type === 'dropOffDate') updateParam('dropOffDate', value);
            else if (activeModal.type === 'dropOffTime') updateParam('dropOffTime', value);
          }}
        />
      )}
    </View>
  );
}
