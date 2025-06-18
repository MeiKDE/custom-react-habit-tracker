import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Palette,
  Smile,
} from "lucide-react-native";
import { createHabit } from "@/lib/appwrite";
import { getHabitColors, getHabitIcons } from "@/utils/habitUtils";

export default function AddHabitScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [reminderTime, setReminderTime] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState(getHabitColors()[0]);
  const [selectedIcon, setSelectedIcon] = useState(getHabitIcons()[0]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const weekDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const toggleWeekDay = (day: number) => {
    setWeekDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleCreateHabit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a habit name");
      return;
    }

    if (frequency === "weekly" && weekDays.length === 0) {
      Alert.alert("Error", "Please select at least one day for weekly habits");
      return;
    }

    setLoading(true);
    try {
      await createHabit({
        name: name.trim(),
        description: description.trim() || undefined,
        frequency,
        weekDays: frequency === "weekly" ? weekDays : undefined,
        reminderTime: reminderTime.trim() || undefined,
        reminderMessage: reminderMessage.trim() || undefined,
        color: selectedColor,
        icon: selectedIcon,
        isActive: true,
      });

      Alert.alert("Success", "Habit created successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to create habit"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-white border-b border-gray-100">
          <TouchableOpacity className="mr-4 p-2" onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">
            Create New Habit
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
          {/* Basic Information */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </Text>

            <Text className="text-gray-700 font-medium mb-2">Habit Name *</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 mb-4"
              placeholder="e.g., Drink 8 glasses of water"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />

            <Text className="text-gray-700 font-medium mb-2">
              Description (Optional)
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              placeholder="Add a description to help you remember..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              maxLength={200}
            />
          </View>

          {/* Frequency */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-4">
              <Calendar size={20} color="#3B82F6" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Frequency
              </Text>
            </View>

            <View className="flex-row mb-4">
              {(["daily", "weekly"] as const).map((freq) => (
                <TouchableOpacity
                  key={freq}
                  className={`flex-1 py-3 px-4 rounded-lg mr-2 last:mr-0 ${
                    frequency === freq ? "bg-primary-500" : "bg-gray-100"
                  }`}
                  onPress={() => setFrequency(freq)}
                >
                  <Text
                    className={`text-center font-medium capitalize ${
                      frequency === freq ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {freq}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {frequency === "weekly" && (
              <View>
                <Text className="text-gray-700 font-medium mb-3">
                  Select Days
                </Text>
                <View className="flex-row flex-wrap">
                  {weekDayNames.map((day, index) => (
                    <TouchableOpacity
                      key={index}
                      className={`w-12 h-12 rounded-full items-center justify-center mr-2 mb-2 ${
                        weekDays.includes(index)
                          ? "bg-primary-500"
                          : "bg-gray-100"
                      }`}
                      onPress={() => toggleWeekDay(index)}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          weekDays.includes(index)
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Reminder */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-4">
              <Clock size={20} color="#3B82F6" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Reminder (Optional)
              </Text>
            </View>

            <Text className="text-gray-700 font-medium mb-2">Time (HH:MM)</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 mb-4"
              placeholder="e.g., 09:00"
              value={reminderTime}
              onChangeText={setReminderTime}
              keyboardType="numeric"
            />

            <Text className="text-gray-700 font-medium mb-2">
              Custom Message
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              placeholder="e.g., Time to hydrate!"
              value={reminderMessage}
              onChangeText={setReminderMessage}
              maxLength={100}
            />
          </View>

          {/* Visual Identity */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-4">
              <Palette size={20} color="#3B82F6" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">
                Visual Identity
              </Text>
            </View>

            <Text className="text-gray-700 font-medium mb-3">
              Choose a Color
            </Text>
            <View className="flex-row flex-wrap mb-6">
              {getHabitColors().map((color) => (
                <TouchableOpacity
                  key={color}
                  className={`w-12 h-12 rounded-full mr-3 mb-3 ${
                    selectedColor === color ? "border-4 border-gray-300" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>

            <Text className="text-gray-700 font-medium mb-3">
              Choose an Icon
            </Text>
            <View className="flex-row flex-wrap">
              {getHabitIcons().map((icon) => (
                <TouchableOpacity
                  key={icon}
                  className={`w-12 h-12 rounded-lg items-center justify-center mr-3 mb-3 ${
                    selectedIcon === icon
                      ? "bg-primary-100 border-2 border-primary-500"
                      : "bg-gray-100"
                  }`}
                  onPress={() => setSelectedIcon(icon)}
                >
                  <Text className="text-lg">{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Preview
            </Text>
            <View className="flex-row items-center">
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: selectedColor + "20" }}
              >
                <Text className="text-lg">{selectedIcon}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {name || "Your habit name"}
                </Text>
                {description && (
                  <Text className="text-sm text-gray-500 mt-1">
                    {description}
                  </Text>
                )}
                <Text className="text-sm text-gray-500 mt-1 capitalize">
                  {frequency === "daily"
                    ? "Daily"
                    : `Weekly • ${weekDays.length} days`}
                </Text>
              </View>
            </View>
          </View>

          {/* Create Button */}
          <TouchableOpacity
            className={`bg-primary-500 rounded-xl py-4 items-center ${
              loading ? "opacity-50" : ""
            }`}
            onPress={handleCreateHabit}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-lg">
              {loading ? "Creating..." : "Create Habit"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
