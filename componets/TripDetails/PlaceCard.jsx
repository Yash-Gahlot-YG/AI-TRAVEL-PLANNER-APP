import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { Colors } from "@/constants/Colors";
import { GetPhotoRef } from "../../services/GooglePlaceApi";

const PlaceCard = ({ locationData, navigateToLocation }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [geometry, setGeometry] = useState(null); // State to hold geometry data
  const [loading, setLoading] = useState(true); // State for loading indicator

  const GetGooglePhotoRef = async () => {
    try {
      const result = await GetPhotoRef(locationData.name);
      const photoReference = result?.results?.[0]?.photos?.[0]?.photo_reference;

      // Extract Geometry data here
      const Geometry = result?.results?.[0]?.geometry?.location;
      setGeometry(Geometry); // Store it in the state
      console.log("Geometry:", Geometry); // Log geometry data for debugging

      if (photoReference) {
        const options = {
          method: "GET",
          url: "https://google-map-places.p.rapidapi.com/maps/api/place/photo",
          params: {
            photo_reference: photoReference,
            maxheight: 1365,
            maxwidth: 2048,
          },
          headers: {
            "x-rapidapi-key":
              "b023ed67cfmsh8a80e388a2ec883p18c18cjsn9605c6077f0d", // Replace with your actual key
            "x-rapidapi-host": "google-map-places.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        setPhotoUrl(response.request.responseURL);
      }
    } catch (error) {
      console.error("Error fetching photo:", error.message);
    } finally {
      setLoading(false); // Stop loading after fetch completes
    }
  };

  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  return (
    <View style={styles.locationCard}>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : (
        <Image
          source={
            photoUrl
              ? { uri: photoUrl }
              : require("./../../assets/images/NoImage1.webp") // Fallback image
          }
          style={styles.locationImage}
        />
      )}
      <Text style={styles.locationName}>{locationData.name}</Text>
      <Text style={styles.locationDetails}>{locationData.details}</Text>
      <View style={styles.ticketInfo}>
        <View>
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
          onPress={() => navigateToLocation(locationData.geo_coordinates)} // Use the extracted Geometry here
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
  ticketText: {
    fontFamily: "outfit",
    fontSize: 17,
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
