import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <View style={{ flex: 1, padding: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY,
        }}
      >
        <Tabs.Screen
          name="mytrip"
          options={{
            tabBarLabel: "My Trip",
            tabBarIcon: ({ color }) => (
              <Ionicons name="location-sharp" size={24} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            tabBarLabel: "Discover",
            tabBarIcon: ({ color }) => (
              <Ionicons name="globe-sharp" size={24} color="black" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people-circle" size={24} color="black" />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({});
