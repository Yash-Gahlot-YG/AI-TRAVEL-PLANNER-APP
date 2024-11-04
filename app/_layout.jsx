import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Text, View } from "react-native";
import { CreateTripContext } from "../context/CreateTripContext"; // Ensure your context is correctly imported
import { useState } from "react";

export default function RootLayout() {
  const [tripData, setTripData] = useState({}); // Store trip data in context
  const [fontsLoaded] = useFonts({
    outfit: require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Bold.ttf"),
  });

  if (!fontsLoaded) {
    // Show a loading screen or nothing until the fonts are loaded
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <CreateTripContext.Provider value={{ tripData, setTripData }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </CreateTripContext.Provider>
  );
}
