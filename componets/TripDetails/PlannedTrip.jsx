import axios from "axios";
import { StyleSheet, Text, View, Linking } from "react-native";
import React, { useEffect } from "react";
import { Colors } from "@/constants/Colors";
import PlaceCard from "./PlaceCard";
import { EXPO_GOOGLE_PLACE_KEY_SUMIT } from "@env";

const PlannedTrip = ({ details }) => {
  useEffect(() => {
    console.log("itinerary:", details); // Log the details to verify the structure
  }, [details]);

  // Return early if details are not valid
  if (!details || typeof details !== "object") return null;

  // Array of times of the day to map over
  const timesOfDay = ["morning", "afternoon", "evening"];

  const fetchPlaceDetails = async (lat, lng) => {
    const placeDetailsUrl = `https://google-map-places.p.rapidapi.com/maps/api/place/nearbysearch/json`;

    const options = {
      method: "GET",
      url: placeDetailsUrl,
      params: {
        location: `${lat},${lng}`,
        radius: "1500",
      },
      headers: {
        "x-rapidapi-key": "c7be0d2d8amshb29e117832ac34ap166f83jsne36cfea8e3c5", // Your RapidAPI key
        "x-rapidapi-host": "google-map-places.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("Nearby Places: ", response.data.results); // Log the results
      return response.data.results; // Return results array
    } catch (error) {
      console.error("Error fetching place details: ", error);
    }
  };
  const navigateToLocation = async (coordinates) => {
    try {
      const cleanedCoordinates = coordinates.trim();
      const [lat, lng] = cleanedCoordinates
        .split(",")
        .map((coord) => coord.trim());

      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", cleanedCoordinates);
        return;
      }

      console.log("Navigating to Latitude:", lat, "Longitude:", lng); // Log the coordinates

      // Fetch nearby places (optional)
      const places = await fetchPlaceDetails(lat, lng);

      // Construct the Google Maps URL
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&zoom=5`;
      console.log("Google Maps URL:", url); // Log the generated URL

      // Open Google Maps with the correct coordinates
      Linking.openURL(url).catch((err) =>
        console.error("Error opening maps: ", err)
      );

      if (places) {
        console.log("Nearby Places,PT: ", places);
      }
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
              return (
                <PlaceCard
                  key={timeOfDay}
                  locationData={locationData}
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
