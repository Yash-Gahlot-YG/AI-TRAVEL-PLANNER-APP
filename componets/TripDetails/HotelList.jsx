import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import HotelCard from "./HotelCard";

const HotelList = ({ hotelList, locationHint }) => {
  if (!hotelList?.length) {
    return (
      <View style={{ marginTop: 5 }}>
        <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
          🏨 Hotel Recommendation
        </Text>
        <Text style={{ fontFamily: "outfit", color: Colors.GRAY, marginTop: 8 }}>
          No hotel recommendations available for this trip.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 5 }}>
      <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
        🏨 Hotel Recommendation
      </Text>
      <FlatList
        style={{ marginTop: 8 }}
        showsHorizontalScrollIndicator={true}
        horizontal={true}
        data={hotelList} // Pass hotelList array to data
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <HotelCard
            item={item}
            locationHint={locationHint}
            staggerIndex={index}
          />
        )}
      />
    </View>
  );
};

export default HotelList;

const styles = StyleSheet.create({});
