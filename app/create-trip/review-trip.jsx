import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SelectBudgetOptions } from "../../constants/Options";
import OptionCard from "../../componets/CreateTrip/OptionCard";
import { CreateTripContext } from "./../../context/CreateTripContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";

const ReviewTrip = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 35,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text style={{ fontFamily: "outfit-bold", fontSize: 35, marginTop: 52 }}>
        Review your trip
      </Text>
      <View style={{ marginTop: 5 }}>
        <Text
          style={{ fontFamily: "outfit-bold", fontSize: 19, marginBottom: 30 }}
        >
          Before generating your trip, please review your selection
        </Text>
        {/* LOCATIONS OF TRIP */}
        <View
          style={{
            marginTop: 10,
            display: "flex",
            gap: 20,
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 30 }}>📍</Text>
          <View>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: Colors.GRAY }}
            >
              Destination
            </Text>
            <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}>
              {tripData?.locationInfo.name}
            </Text>
          </View>
        </View>
        {/* DATES OF TRIP */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 30 }}>🗓️</Text>
          <View>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: Colors.GRAY }}
            >
              Travel Date
            </Text>
            <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}>
              {moment(tripData?.startDate).format("DD MMM") +
                " To " +
                moment(tripData?.endDate).format("DD MMM")}
              {"  "}({tripData?.totalNoOfDays} days)
            </Text>
          </View>
        </View>
        {/* TRAVELER INFO */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 28 }}>✈️ </Text>
          <View>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: Colors.GRAY }}
            >
              Who is Traveling
            </Text>
            <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}>
              {tripData?.traveler?.title}
            </Text>
          </View>
        </View>
        {/* TRAVELER INFO */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 31 }}>💰</Text>
          <View>
            <Text
              style={{ fontFamily: "outfit", fontSize: 20, color: Colors.GRAY }}
            >
              Budget
            </Text>
            <Text style={{ fontSize: 20, fontFamily: "outfit-medium" }}>
              {tripData?.budget}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.replace("/create-trip/generate-trip");
        }}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 90,
          width: "100%",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
            fontFamily: "outfit-medium",
            fontSize: 20,
          }}
        >
          Build My trip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewTrip;

const styles = StyleSheet.create({});
