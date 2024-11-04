import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { GetPhotoRef } from "../../services/GooglePlaceApi";
import {
  EXPO_GOOGLE_MAP_KEY1,
  EXPO_GOOGLE_MAP_KEY_479,
  EXPO_GOOGLE_PLACE_KEY_107,
} from "@env";

const HotelCard = ({ item }) => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading status

  // Function to fetch the photo reference and image URL
  const GetGooglePhotoRef = async () => {
    try {
      const result = await GetPhotoRef(item.name);
      const photoReference = result?.results[0]?.photos[0]?.photo_reference;

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
              "3526df2599msh30d37fd54520d49p1f6771jsna48ee5997cd6", // Replace with your actual key
            "x-rapidapi-host": "google-map-places.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        setPhotoUrl(response.request.responseURL);
      }
    } catch (error) {
      console.error("Error fetching photo:", error.message);
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  // Fetch photo on component mount
  useEffect(() => {
    GetGooglePhotoRef();
  }, []);

  return (
    <View style={{ marginRight: 20, width: 180 }}>
      {loading ? (
        // Show loading indicator while image is loading
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={{ height: 120, justifyContent: "center" }}
        />
      ) : (
        <Image
          source={
            photoUrl
              ? { uri: photoUrl }
              : require("./../../assets/images/NoImage1.webp")
          } // Use photoUrl if available
          style={{
            width: 180,
            height: 120,
            borderRadius: 15,
          }}
        />
      )}
      <View style={{ padding: 5 }}>
        <Text style={{ fontFamily: "outfit-medium", fontSize: 17 }}>
          {item.name}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 5,
          }}
        >
          <Text style={{ fontFamily: "outfit" }}>⭐{item.rating}</Text>
          <Text style={{ fontFamily: "outfit" }}>💰{item.price}</Text>
        </View>
      </View>
    </View>
  );
};

export default HotelCard;

const styles = StyleSheet.create({});
