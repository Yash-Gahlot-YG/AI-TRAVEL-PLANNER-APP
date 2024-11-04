import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CreateTripContext } from "../../context/CreateTripContext";
import { Colors } from "@/constants/Colors";
import moment from "moment";
import { useLocalSearchParams } from "expo-router";
import FlightInfo from "../../componets/TripDetails/FlightInfo";
import HotelList from "../../componets/TripDetails/HotelList";
import PlannedTrip from "../../componets/TripDetails/PlannedTrip";
import { EXPO_GOOGLE_MAP_KEY1, EXPO_GOOGLE_MAP_KEY_479 } from "@env";

const TripDetails = () => {
  const { tripData: contextTripData } = useContext(CreateTripContext);
  const [tripDetails, setTripDetails] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const { trip, photoRef } = useLocalSearchParams(); // No need to extract flightDetails separately

  // Fetch and parse trip details
  useEffect(() => {
    if (trip) {
      try {
        const parsedTrip = JSON.parse(trip); // Parse the entire trip
        const parsedTripData = JSON.parse(parsedTrip.tripData); // Parse tripData inside trip
        setTripDetails({ ...parsedTrip, tripData: parsedTripData }); // Set both parsedTrip and parsedTripData
        // console.log("Parsed trip data:", parsedTrip); // Log to check the parsed data
        // console.log("tripPlan 26:", tripPlan.itinerary);
      } catch (error) {
        console.error("Error parsing trip data:", error);
      }
    }
  }, [trip]);

  // Fetch photo URL using API
  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (!photoRef) return;

      const options = {
        method: "GET",
        url: "https://google-map-places.p.rapidapi.com/maps/api/place/photo",
        params: {
          photo_reference: photoRef,
          maxheight: 1365,
          maxwidth: 2048,
        },
        headers: {
          "x-rapidapi-key":
            "c2cf11c4eemsh19dfa53b857e5b0p18601ejsn53a257643fdc", // Replace with your actual API key
          "x-rapidapi-host": "google-map-places.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setPhotoUrl(response.request.responseURL);
      } catch (error) {
        console.error("Error fetching photo URL:", error.message);
      }
    };

    fetchPhotoUrl();
  }, [photoRef]);

  // Display a loading state until trip details are fetched
  if (!tripDetails) {
    return <Text>Loading trip details...</Text>;
  }

  // Destructure parsedTrip and tripData for easy access
  const { tripData, tripPlan } = tripDetails;
  // console.log("69..", tripPlan);

  return (
    <ScrollView>
      {/* Display photo if available */}
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.image} />
      ) : (
        <Image
          source={require("./../../assets/images/NoImage1.webp")}
          style={styles.image}
        />
      )}

      {/* Trip Info */}
      <View style={styles.infoContainer}>
        {/* Location Info */}
        <Text style={styles.cityText}>
          {tripData.locationInfo?.name || "Unknown Location"}
        </Text>

        {/* Dates */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>
            {moment(tripData.startDate).format("DD MMM yyyy")} -
          </Text>
          <Text style={styles.dateText}>
            {moment(tripData.endDate).format(" DD MMM yyyy")}
          </Text>
        </View>

        {/* Traveler Info */}
        <Text style={styles.travelerText}>
          🚎 {tripData.traveler?.title || "Traveler Info Unavailable"}
        </Text>

        {/* Flight Price */}
        <FlightInfo
          flightData={tripPlan?.flight?.details}
          price={tripPlan?.flight?.price}
          booking_url={tripPlan?.flight?.booking_url}
        />
        {/* Hotel List */}
        <HotelList hotelList={tripPlan?.hotels} />
        {/* Trip Day Planner Info */}
        <PlannedTrip details={tripPlan?.itinerary} />
      </View>
    </ScrollView>
  );
};

export default TripDetails;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 350,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    height: "100%",
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  cityText: {
    fontFamily: "outfit-bold",
    fontSize: 25,
  },
  dateContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  dateText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.GRAY,
  },
  travelerText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.GRAY,
    top: 5,
  },
});
