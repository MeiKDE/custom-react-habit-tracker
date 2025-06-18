// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { Client, Account, Databases, ID } from "appwrite";

// // Initialize Appwrite Client
// // IMPORTANT: Replace with your actual Appwrite endpoint and project ID
// const client = new Client();

// client
//   .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
//   .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID); // Your project ID from Appwrite console

// const account = new Account(client);
// const databases = new Databases(client);

// // Define your database and collection IDs (replace with your actual IDs)
// const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
// const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID; // Example: for a 'users_data' collection

// export default function App() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [userData, setUserData] = useState([]); // To store data fetched from Appwrite DB
//   const [message, setMessage] = useState(""); // General message for user feedback

//   // Function to show a custom alert message
//   const showAlert = (title, msg) => {
//     Alert.alert(title, msg); // Using Alert for simplicity, you can replace with custom modal
//   };

//   // Check current user session on app load
//   useEffect(() => {
//     checkUserSession();
//   }, []);

//   const checkUserSession = async () => {
//     setLoading(true);
//     try {
//       const currentAccount = await account.get();
//       setIsLoggedIn(true);
//       setName(currentAccount.name);
//       setEmail(currentAccount.email); // Set email if logged in
//       showAlert("Success", `Welcome back, ${currentAccount.name}!`);
//       fetchUserData(); // Fetch user-specific data if logged in
//     } catch (error) {
//       console.log("No active session:", error.message);
//       setIsLoggedIn(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSignup = async () => {
//     if (!email || !password || !name) {
//       showAlert("Error", "Please fill in all fields (Name, Email, Password).");
//       return;
//     }
//     setLoading(true);
//     try {
//       await account.create(ID.unique(), email, password, name);
//       showAlert("Success", "Account created successfully! Please log in.");
//       // Clear fields after successful signup
//       setEmail("");
//       setPassword("");
//       setName("");
//     } catch (error) {
//       console.error("Signup Error:", error);
//       showAlert(
//         "Signup Failed",
//         error.message || "Something went wrong during signup."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       showAlert("Error", "Please enter your Email and Password.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await account.createEmailPasswordSession(email, password);
//       const currentAccount = await account.get();
//       setIsLoggedIn(true);
//       setName(currentAccount.name);
//       showAlert("Success", `Logged in as ${currentAccount.name}`);
//       fetchUserData(); // Fetch data specific to the logged-in user
//     } catch (error) {
//       console.error("Login Error:", error);
//       showAlert(
//         "Login Failed",
//         error.message || "Invalid credentials or something went wrong."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       await account.deleteSession("current");
//       setIsLoggedIn(false);
//       setName("");
//       setEmail("");
//       setUserData([]);
//       showAlert("Success", "Logged out successfully!");
//     } catch (error) {
//       console.error("Logout Error:", error);
//       showAlert(
//         "Logout Failed",
//         error.message || "Something went wrong during logout."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Example: Fetching data from a Appwrite database collection
//   const fetchUserData = async () => {
//     setLoading(true);
//     try {
//       // Ensure you have a 'users_data' collection and appropriate read permissions
//       // You might want to filter data by user ID if it's user-specific
//       const response = await databases.listDocuments(
//         DATABASE_ID,
//         COLLECTION_ID
//       );
//       setUserData(response.documents);
//       setMessage(`Fetched ${response.documents.length} items from database.`);
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setMessage(
//         "Failed to fetch user data. Check permissions or collection ID."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Example: Adding data to a Appwrite database collection
//   const handleAddData = async () => {
//     setLoading(true);
//     try {
//       const response = await databases.createDocument(
//         DATABASE_ID,
//         COLLECTION_ID,
//         ID.unique(),
//         {
//           // Example data fields. Adjust according to your collection's attributes.
//           userId: account.current.$id, // Link to current user if needed
//           timestamp: new Date().toISOString(),
//           some_data_field: `New data item ${Math.random().toFixed(2)}`,
//         }
//       );
//       showAlert("Success", "Data added successfully!");
//       fetchUserData(); // Refresh data after adding
//     } catch (error) {
//       console.error("Error adding data:", error);
//       showAlert(
//         "Error",
//         "Failed to add data. Check database permissions or collection ID."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-gray-100 p-6">
//       <View className="flex-1 justify-center items-center mt-12">
//         <Text className="text-3xl font-bold text-blue-700 mb-8 rounded-lg shadow-lg p-4 bg-white">
//           Appwrite React Native
//         </Text>

//         {loading && (
//           <View className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 rounded-lg">
//             <ActivityIndicator size="large" color="#ffffff" />
//             <Text className="text-white text-lg mt-4">Loading...</Text>
//           </View>
//         )}

//         {isLoggedIn ? (
//           <View className="w-full max-w-md bg-white p-8 rounded-lg shadow-md mb-8">
//             <Text className="text-2xl font-semibold mb-4 text-center text-gray-800">
//               Welcome, {name}!
//             </Text>
//             <Text className="text-md mb-4 text-center text-gray-600">
//               You are logged in with: {email}
//             </Text>

//             <TouchableOpacity
//               onPress={handleAddData}
//               className="bg-green-500 p-4 rounded-md mb-4 shadow-sm"
//             >
//               <Text className="text-white text-lg font-bold text-center">
//                 Add Sample Data
//               </Text>
//             </TouchableOpacity>

//             <Text className="text-lg font-semibold mt-6 mb-2 text-gray-700">
//               Fetched Data:
//             </Text>
//             {message ? (
//               <Text className="text-sm text-gray-500 mb-4">{message}</Text>
//             ) : null}
//             {userData.length === 0 && !loading && (
//               <Text className="text-gray-500 italic">
//                 No data found in collection.
//               </Text>
//             )}
//             {userData.map((item, index) => (
//               <View
//                 key={item.$id}
//                 className="bg-blue-100 p-3 rounded-md mb-2 shadow-sm"
//               >
//                 <Text className="font-bold text-blue-800">ID: {item.$id}</Text>
//                 {/* Display other relevant fields from your document */}
//                 {item.some_data_field && (
//                   <Text className="text-blue-700">
//                     Data Field: {item.some_data_field}
//                   </Text>
//                 )}
//                 {item.timestamp && (
//                   <Text className="text-blue-700">
//                     Timestamp: {new Date(item.timestamp).toLocaleString()}
//                   </Text>
//                 )}
//               </View>
//             ))}

//             <TouchableOpacity
//               onPress={handleLogout}
//               className="bg-red-500 p-4 rounded-md mt-6 shadow-sm"
//             >
//               <Text className="text-white text-lg font-bold text-center">
//                 Logout
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
//             <Text className="text-2xl font-semibold mb-6 text-center text-gray-800">
//               Sign Up / Login
//             </Text>

//             <TextInput
//               className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               placeholder="Name (for Sign Up)"
//               value={name}
//               onChangeText={setName}
//               autoCapitalize="words"
//               editable={!isLoggedIn} // Only editable if not logged in
//             />
//             <TextInput
//               className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-500"
//               placeholder="Email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <TextInput
//               className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//               placeholder="Password"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//             />

//             <TouchableOpacity
//               onPress={handleSignup}
//               className="bg-blue-600 p-4 rounded-md mb-4 shadow-sm"
//             >
//               <Text className="text-white text-lg font-bold text-center">
//                 Sign Up
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={handleLogin}
//               className="bg-indigo-600 p-4 rounded-md shadow-sm"
//             >
//               <Text className="text-white text-lg font-bold text-center">
//                 Login
//               </Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// }
