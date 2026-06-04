import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import PlacePhotoImage from "./PlacePhotoImage";

const PlaceCard = ({
  locationData,
  navigateToLocation,
  locationHint,
  staggerIndex = 0,
}) => {
  return (
    <View style={styles.locationCard}>
      <PlacePhotoImage
        name={locationData?.name}
        locationHint={locationHint}
        imageUrl={locationData?.image_url}
        staggerIndex={staggerIndex}
        style={styles.locationImage}
        loaderStyle={styles.loadingIndicator}
      />
      <Text style={styles.locationName}>{locationData.name}</Text>
      <Text style={styles.locationDetails}>{locationData.details}</Text>
      <View style={styles.ticketInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.ticketText}>
            🎟️ Ticket Price:{" "}
            <Text style={styles.ticketBold}>{locationData.ticket_pricing}</Text>
          </Text>
          <Text style={styles.ticketText}>
            ⏱️ Travel Time:{" "}
            <Text style={styles.ticketBold}>{locationData.time_to_travel}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.navigateButton}
          accessible={true}
          accessibilityLabel="Navigate to location"
          onPress={() =>
            navigateToLocation(locationData.geo_coordinates, locationData.name)
          }
        >
          <Ionicons name="navigate" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaceCard;

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: "#F0FAFF",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    borderColor: "#ddd",
    marginTop: 20,
  },
  locationImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
  locationName: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    marginTop: 5,
  },
  locationDetails: {
    fontFamily: "outfit",
    fontSize: 15,
    color: "#888",
  },
  ticketInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  ticketText: {
    fontFamily: "outfit",
    fontSize: 14,
  },
  ticketBold: {
    fontFamily: "outfit-bold",
  },
  navigateButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 7,
  },
  loadingIndicator: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
