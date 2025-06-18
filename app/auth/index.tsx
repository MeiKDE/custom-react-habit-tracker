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
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react-native";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    Alert.alert(
      "Coming Soon",
      "Google OAuth will be implemented in the next update"
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 px-6 pt-12">
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-primary-500 rounded-full justify-center items-center mb-4">
                <Text className="text-white text-3xl font-bold">H</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </Text>
              <Text className="text-gray-600 text-center">
                {isSignUp
                  ? "Start building better habits today"
                  : "Sign in to continue your habit journey"}
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {isSignUp && (
                <View className="relative">
                  <View className="absolute left-4 top-4 z-10">
                    <User size={20} color="#6B7280" />
                  </View>
                  <TextInput
                    className="bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-gray-800"
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Mail size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-gray-800"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <Lock size={20} color="#6B7280" />
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-12 py-4 text-gray-800"
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                className={`bg-primary-500 rounded-xl py-4 items-center mt-6 ${
                  loading ? "opacity-50" : ""
                }`}
                onPress={handleAuth}
                disabled={loading}
              >
                <Text className="text-white font-semibold text-lg">
                  {loading
                    ? "Please wait..."
                    : isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View className="flex-row items-center my-6">
                <View className="flex-1 h-px bg-gray-200" />
                <Text className="mx-4 text-gray-500">OR</Text>
                <View className="flex-1 h-px bg-gray-200" />
              </View>

              {/* Google Sign In */}
              <TouchableOpacity
                className="bg-white border border-gray-200 rounded-xl py-4 items-center flex-row justify-center"
                onPress={handleGoogleAuth}
              >
                <View className="w-6 h-6 bg-red-500 rounded mr-3" />
                <Text className="text-gray-800 font-semibold">
                  Sign in with Google
                </Text>
              </TouchableOpacity>

              {/* Toggle Auth Mode */}
              <View className="flex-row justify-center mt-8">
                <Text className="text-gray-600">
                  {isSignUp
                    ? "Already have an account? "
                    : "Don't have an account? "}
                </Text>
                <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                  <Text className="text-primary-500 font-semibold">
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
