import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import SearchPlace from "@/app/create-trip/search-place";
export default function StartNewTripCard() {
  const router = useRouter();
  return (
    <View
      style={{
        padding: 20,
        marginTop: 50,
        alignItems: "center",
        display: "flex",
        gap: 25,
      }}
    >
      <Ionicons name="location-sharp" size={30} color="black" />
      <Text style={{ fontSize: 25, fontFamily: "outfit-medium" }}>
        No trips planned yet
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit",
          color: Colors.GRAY,
          textAlign: "center",
        }}
      >
        Looks like its time to plan a new travel experinece! Get Started below
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/create-trip/search-place")}
        style={{
          padding: 20,
          backgroundColor: Colors.PRIMARY,
          marginHorizontal: 30,
          borderRadius: 15,
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 17,
            fontFamily: "outfit-medium",
          }}
        >
          Start a new trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
