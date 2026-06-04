import { StyleSheet, Text, View, Linking } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import PlaceCard from "./PlaceCard";

const parseCoordinates = (coordinates) => {
  if (!coordinates) return null;

  if (typeof coordinates === "string") {
    const [lat, lng] = coordinates.split(",").map((coord) => coord.trim());
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
    return null;
  }

  if (typeof coordinates === "object") {
    const lat = coordinates.lat ?? coordinates.latitude;
    const lng = coordinates.lng ?? coordinates.longitude ?? coordinates.lon;
    if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
      return { lat: String(lat), lng: String(lng) };
    }
  }

  return null;
};

const PlannedTrip = ({ details, locationHint }) => {
  if (!details || typeof details !== "object") return null;

  const timesOfDay = ["morning", "afternoon", "evening"];
  let imageLoadIndex = 0;

  const navigateToLocation = async (coordinates, placeName) => {
    try {
      const parsed = parseCoordinates(coordinates);

      const url = parsed
        ? `https://www.google.com/maps/search/?api=1&query=${parsed.lat},${parsed.lng}`
        : placeName
          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`
          : null;

      if (!url) return;

      await Linking.openURL(url);
    } catch (error) {
      console.error("Error navigating to location:", error);
    }
  };

  return (
    <View style={{ marginTop: 15 }}>
      <Text style={{ fontSize: 20, fontFamily: "outfit-bold" }}>
        🏕️ Planned Trip
      </Text>

      {Object.entries(details)
        .sort(([dayA], [dayB]) => {
          // Assuming day strings are like 'day1', 'day2', extract the number and compare
          const dayNumA = parseInt(dayA.match(/\d+/)[0], 10);
          const dayNumB = parseInt(dayB.match(/\d+/)[0], 10);
          return dayNumA - dayNumB;
        })
        .map(([day, dayDetails], index) => (
          <View key={index} style={{ marginTop: 10, gap: 5 }}>
            <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}>
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </Text>

            {timesOfDay.map((timeOfDay) => {
              const locationData = dayDetails[timeOfDay]?.location;
              if (!locationData) return null; // Skip if no data
              imageLoadIndex += 1;
              return (
                <PlaceCard
                  key={timeOfDay}
                  locationData={locationData}
                  locationHint={locationHint}
                  staggerIndex={imageLoadIndex}
                  navigateToLocation={navigateToLocation}
                />
              );
            })}
          </View>
        ))}
    </View>
  );
};

export default PlannedTrip;

const styles = StyleSheet.create({
  locationCard: {
    backgroundColor: "#F0FAFF",
    marginVertical: 5,
    padding: 10,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    marginTop: 20,
  },
  locationImage: {
    width: "100%",
    height: 120,
    borderRadius: 15,
  },
  locationName: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    marginTop: 5,
  },
  locationDetails: {
    fontFamily: "outfit",
    fontSize: 17,
    color: Colors.GRAY,
  },
  ticketInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ticketText: {
    fontFamily: "outfit",
    fontSize: 17,
    marginTop: 5,
  },
  ticketBold: {
    fontFamily: "outfit-bold",
  },
  navigateButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 7,
  },
});
