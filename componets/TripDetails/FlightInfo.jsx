import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native"; // Add Linking here
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";

const FlightInfo = ({ flightData, price, booking_url }) => {
  if (!flightData || Object.keys(flightData).length === 0) {
    console.log("No flight details available");
    return <Text>No flight details available</Text>;
  }

  useEffect(() => {
    console.log("Flight Data:", flightData);
  }, [flightData]);

  const {
    flight_number,
    departure_city,
    arrival_city,
    departure_date,
    return_date,
    airline,
  } = flightData;

  const handleBookNow = () => {
    if (booking_url) {
      // Use the booking_url prop
      Linking.openURL(booking_url).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    } else {
      console.log("No booking URL available");
    }
  };

  return (
    <BlurView intensity={90} style={styles.glassCard}>
      <View
        style={{
          marginTop: 30,
          // backgroundColor: Colors.LIGHT_GRAY,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          padding: 10,
          borderRadius: 15,
          borderWidth: 1,
          top: -9,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
            ✈️ Flights
          </Text>
          <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
            <Text style={styles.bookButtonText}>Book Here</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontFamily: "outfit", fontSize: 17 }}>
          Airline: {airline || "Not Available"}
        </Text>
        <Text style={{ fontFamily: "outfit", fontSize: 17 }}>
          Flight Price: {price || "Not Available"}
        </Text>
      </View>
    </BlurView>
  );
};

export default FlightInfo;

const styles = StyleSheet.create({
  bookButton: {
    backgroundColor: "black",
    padding: 5,
    width: 100,
    borderRadius: 7,
  },
  bookButtonText: {
    textAlign: "center",
    color: Colors.WHITE,
    fontFamily: "outfit",
  },
  glassCard: {},
});
