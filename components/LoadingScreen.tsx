import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export const LoadingScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <View className="items-center">
        <View className="w-20 h-20 bg-primary-500 rounded-full justify-center items-center mb-6">
          <Text className="text-white text-2xl font-bold">H</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-2">HabitFlow</Text>
        <Text className="text-gray-600 mb-8">
          Building better habits, one day at a time
        </Text>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    </View>
  );
};
