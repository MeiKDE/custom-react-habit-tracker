import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Heart,
} from "lucide-react-native";
import { useAuth } from "@/context/AuthContext";

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
            router.replace("/auth");
          } catch (error) {
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  const handleContactSupport = () => {
    Linking.openURL("mailto:support@habitflow.app?subject=Support Request");
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      "Privacy Policy",
      "Privacy policy would open here in a real app"
    );
  };

  const handleTermsOfService = () => {
    Alert.alert(
      "Terms of Service",
      "Terms of service would open here in a real app"
    );
  };

  const SettingsItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showChevron?: boolean;
  }> = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showChevron = true,
  }) => (
    <TouchableOpacity
      className="bg-white px-4 py-4 flex-row items-center"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-4">
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-gray-800 font-medium">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      {rightElement ||
        (showChevron && <ChevronRight size={20} color="#9CA3AF" />)}
    </TouchableOpacity>
  );

  const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <Text className="text-gray-500 font-medium text-sm mb-2 mt-6 px-4">
      {title.toUpperCase()}
    </Text>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Settings
          </Text>

          {/* User Profile Card */}
          <View className="bg-white rounded-xl p-4 mb-6">
            <View className="flex-row items-center">
              <View className="w-16 h-16 bg-primary-500 rounded-full items-center justify-center mr-4">
                <Text className="text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">
                  {user?.name}
                </Text>
                <Text className="text-gray-600">{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        <View className="px-2">
          <SectionHeader title="Account" />
          <View className="bg-white rounded-xl mb-4 overflow-hidden">
            <SettingsItem
              icon={<User size={20} color="#6B7280" />}
              title="Profile Information"
              subtitle="Update your personal details"
              onPress={() =>
                Alert.alert("Profile", "Profile editing would open here")
              }
            />
            <View className="h-px bg-gray-100 ml-14" />
            <SettingsItem
              icon={<Shield size={20} color="#6B7280" />}
              title="Change Password"
              subtitle="Update your account password"
              onPress={() =>
                Alert.alert("Password", "Password change would open here")
              }
            />
          </View>

          <SectionHeader title="Preferences" />
          <View className="bg-white rounded-xl mb-4 overflow-hidden">
            <SettingsItem
              icon={<Bell size={20} color="#6B7280" />}
              title="Notifications"
              subtitle={notificationsEnabled ? "Enabled" : "Disabled"}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                  thumbColor={notificationsEnabled ? "white" : "#9CA3AF"}
                />
              }
              showChevron={false}
            />
          </View>

          <SectionHeader title="Support" />
          <View className="bg-white rounded-xl mb-4 overflow-hidden">
            <SettingsItem
              icon={<HelpCircle size={20} color="#6B7280" />}
              title="Help & Support"
              subtitle="Get help and contact us"
              onPress={handleContactSupport}
            />
            <View className="h-px bg-gray-100 ml-14" />
            <SettingsItem
              icon={<Mail size={20} color="#6B7280" />}
              title="Send Feedback"
              subtitle="Help us improve the app"
              onPress={() =>
                Alert.alert("Feedback", "Feedback form would open here")
              }
            />
            <View className="h-px bg-gray-100 ml-14" />
            <SettingsItem
              icon={<Heart size={20} color="#6B7280" />}
              title="Rate the App"
              subtitle="Share your experience"
              onPress={() =>
                Alert.alert("Rate App", "App store rating would open here")
              }
            />
          </View>

          <SectionHeader title="Legal" />
          <View className="bg-white rounded-xl mb-4 overflow-hidden">
            <SettingsItem
              icon={<Shield size={20} color="#6B7280" />}
              title="Privacy Policy"
              onPress={handlePrivacyPolicy}
            />
            <View className="h-px bg-gray-100 ml-14" />
            <SettingsItem
              icon={<Shield size={20} color="#6B7280" />}
              title="Terms of Service"
              onPress={handleTermsOfService}
            />
          </View>

          {/* Sign Out */}
          <View className="bg-white rounded-xl mb-8 overflow-hidden">
            <SettingsItem
              icon={<LogOut size={20} color="#EF4444" />}
              title="Sign Out"
              onPress={handleSignOut}
              showChevron={false}
            />
          </View>

          {/* App Version */}
          <Text className="text-center text-gray-500 text-sm mb-8">
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
