import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import moment from "moment";
import axios from "axios"; // Ensure axios is imported
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "../../context/CreateTripContext";

const UserTripCard = ({ trip }) => {
  const { tripData: contextTripData } = useContext(CreateTripContext);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading

  // Prefer trip data from props, fallback to context if needed
  const tripData = trip?.tripData || contextTripData;

  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Invalid JSON data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      const formattedTripData = formatData(tripData);

      if (!formattedTripData || !formattedTripData.locationInfo?.photoRef) {
        console.error("No photo reference available");
        setLoading(false); // No need to show loading if there's no photo reference
        return;
      }

      const options = {
        method: "GET",
        url: "https://google-map-places.p.rapidapi.com/maps/api/place/photo",
        params: {
          photo_reference: formattedTripData.locationInfo.photoRef,
          maxheight: 1365,
          maxwidth: 2048,
        },
        headers: {
          "x-rapidapi-key":
            "cc667e016cmshc1ca2bedbb37b04p156b16jsn18845ed58250", // Use environment variable
          "x-rapidapi-host": "google-map-places.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setPhotoUrl(response.request.responseURL);
      } catch (error) {
        console.error("Error fetching photo URL:", error.message);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    if (tripData) {
      fetchPhotoUrl();
    }
  }, [tripData]);

  if (!tripData) {
    return <Text>No trip data available</Text>;
  }

  const formattedTripData = formatData(tripData);

  return (
    <View style={styles.container}>
      {loading ? ( // Show loading indicator if loading
        <ActivityIndicator size="small" color={Colors.PRIMARY} />
      ) : photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.image} />
      ) : (
        <Image
          source={require("./../../assets/images/NoImage1.webp")} // Fallback image
          style={styles.image}
        />
      )}
      <View>
        <Text style={styles.cityText}>
          {trip.tripPlan?.flight?.details?.arrival_city ||
            "Location not available"}
        </Text>
        <Text style={styles.dateText}>
          {formattedTripData?.startDate
            ? moment(formattedTripData.startDate).format("DD MMM yyyy")
            : "Date not available"}
        </Text>
        <Text style={styles.travelerText}>
          Traveling: {formattedTripData?.traveler?.title || "Unknown"}
        </Text>
      </View>
    </View>
  );
};

export default UserTripCard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
  cityText: {
    fontFamily: "outfit-medium",
    fontSize: 18,
  },
  dateText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
  travelerText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
  },
});
