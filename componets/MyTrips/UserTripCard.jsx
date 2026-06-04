import { StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { Colors } from "@/constants/Colors";
import { fetchPlacePhotoDataUri } from "../../services/GooglePlaceApi";

const UserTripCard = ({ trip }) => {
  const formatData = (data) => {
    try {
      return typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return null;
    }
  };

  const formattedTripData = formatData(trip?.tripData);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const photoRef = formattedTripData?.locationInfo?.photoRef;

    if (!photoRef) {
      setPhotoUrl(null);
      return;
    }

    const loadPhoto = async () => {
      try {
        const dataUri = await fetchPlacePhotoDataUri(photoRef);
        if (isMounted) {
          setPhotoUrl(dataUri);
        }
      } catch (error) {
        console.error("Error fetching trip card photo:", error);
      }
    };

    loadPhoto();

    return () => {
      isMounted = false;
    };
  }, [formattedTripData?.locationInfo?.photoRef]);

  if (!formattedTripData) {
    return <Text>No trip data available</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          photoUrl
            ? { uri: photoUrl }
            : require("./../../assets/images/NoImage1.webp")
        }
        style={styles.image}
      />
      <View>
        <Text style={styles.cityText}>
          {trip.tripPlan?.flight?.details?.arrival_city ||
            formattedTripData?.locationInfo?.name ||
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
