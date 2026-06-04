import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { CreateTripContext } from "./../../context/CreateTripContext";
import moment from "moment";
import { Colors } from "@/constants/Colors";
import UserTripCard from "./../../componets/MyTrips/UserTripCard";
import { useRouter } from "expo-router";
import { fetchPlacePhotoDataUri } from "../../services/GooglePlaceApi";
import { StatusBar } from "react-native";

const UserTripList = ({ userTrips }) => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const LatestTrip = JSON.parse(userTrips[selectedTripIndex]?.tripData || "{}");
  const router = useRouter();

  const [photoUrl, setPhotoUrl] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true); // State to track loading

  useEffect(() => {
    const loadPhoto = async () => {
      setLoadingImage(true);
      setPhotoUrl(null);

      const photoRef = LatestTrip?.locationInfo?.photoRef;
      if (!photoRef) {
        setLoadingImage(false);
        return;
      }

      const dataUri = await fetchPlacePhotoDataUri(photoRef);
      setPhotoUrl(dataUri);
      setLoadingImage(false);
    };

    loadPhoto();
  }, [selectedTripIndex]);

  return (
    <View>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={{ marginTop: 20 }}>
        {loadingImage ? ( // Show loading indicator if loading
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        ) : photoUrl ? (
          <Image
            source={{ uri: photoUrl }}
            style={{ width: "100%", height: 250, borderRadius: 15 }}
          />
        ) : (
          <Image
            source={require("./../../assets/images/NoImage1.webp")}
            style={{ width: "100%", height: 250, borderRadius: 15 }}
          />
        )}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>
            {LatestTrip.locationInfo?.name || "Location not available"}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text
              style={{ fontSize: 17, fontFamily: "outfit", color: Colors.GRAY }}
            >
              {moment(LatestTrip?.startDate).format("DD MMM yyyy")}
            </Text>
            <Text
              style={{ fontSize: 17, fontFamily: "outfit", color: Colors.GRAY }}
            >
              ✈️{LatestTrip.traveler?.title || "Traveler not available"}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: "/trip-details",
                params: {
                  trip: JSON.stringify(userTrips[selectedTripIndex]),
                  photoRef: LatestTrip?.locationInfo?.photoRef,
                  flightDetails: JSON.stringify(LatestTrip?.tripPlan?.flight),
                },
              });
            }}
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 15,
              borderRadius: 15,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                textAlign: "center",
                fontFamily: "outfit-medium",
                fontSize: 15,
              }}
            >
              See your plan
            </Text>
          </TouchableOpacity>
        </View>
        {userTrips.map((trip, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedTripIndex(index)}
          >
            <UserTripCard trip={trip} key={index} />
          </TouchableOpacity>
        ))}
      </View>
      <View>
        <Text></Text>
      </View>
      <View>
        <Text></Text>
      </View>
      <View>
        <Text></Text>
      </View>
    </View>
  );
};

export default UserTripList;

const styles = StyleSheet.create({});
