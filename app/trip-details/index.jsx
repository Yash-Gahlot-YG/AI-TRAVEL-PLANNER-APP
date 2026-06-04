import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { CreateTripContext } from "../../context/CreateTripContext";
import { Colors } from "@/constants/Colors";
import moment from "moment";
import { useLocalSearchParams } from "expo-router";
import FlightInfo from "../../componets/TripDetails/FlightInfo";
import HotelList from "../../componets/TripDetails/HotelList";
import PlannedTrip from "../../componets/TripDetails/PlannedTrip";
import PlacePhotoImage from "../../componets/TripDetails/PlacePhotoImage";
import { normalizeTripPlan } from "../../utils/tripPlan";

const TripDetails = () => {
  const { tripData: contextTripData } = useContext(CreateTripContext);
  const [tripDetails, setTripDetails] = useState(null);
  const { trip, photoRef: photoRefParam } = useLocalSearchParams();
  const photoRef = Array.isArray(photoRefParam) ? photoRefParam[0] : photoRefParam;

  // Fetch and parse trip details
  useEffect(() => {
    if (trip) {
      try {
        const parsedTrip = JSON.parse(trip); // Parse the entire trip
        const parsedTripData = JSON.parse(parsedTrip.tripData); // Parse tripData inside trip
        setTripDetails({
          ...parsedTrip,
          tripData: parsedTripData,
          tripPlan: normalizeTripPlan(parsedTrip.tripPlan),
        });
        // console.log("Parsed trip data:", parsedTrip); // Log to check the parsed data
        // console.log("tripPlan 26:", tripPlan.itinerary);
      } catch (error) {
        console.error("Error parsing trip data:", error);
      }
    }
  }, [trip]);

  // Display a loading state until trip details are fetched
  if (!tripDetails) {
    return <Text>Loading trip details...</Text>;
  }

  // Destructure parsedTrip and tripData for easy access
  const { tripData, tripPlan } = tripDetails;
  // console.log("69..", tripPlan);

  return (
    <ScrollView>
      <PlacePhotoImage
        photoRef={photoRef}
        name={tripData?.locationInfo?.name}
        style={styles.image}
        loaderStyle={[styles.image, { justifyContent: "center" }]}
      />

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
        <HotelList
          hotelList={tripPlan?.hotels}
          locationHint={tripData.locationInfo?.name}
        />
        {/* Trip Day Planner Info */}
        <PlannedTrip
          details={tripPlan?.itinerary}
          locationHint={tripData.locationInfo?.name}
        />
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
