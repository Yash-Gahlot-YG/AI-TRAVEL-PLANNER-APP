import { StyleSheet, Text, View, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import { tr } from "date-fns/locale";
import { GetPhotoRef } from "../../services/GooglePlaceApi";
import HotelCard from "./HotelCard";

const HotelList = ({ hotelList }) => {
  // useEffect(() => {
  //   GetGooglePhotoRef();
  // }, []);

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
        renderItem={({ item }) => <HotelCard item={item} />}
      />
    </View>
  );
};

export default HotelList;

const styles = StyleSheet.create({});
