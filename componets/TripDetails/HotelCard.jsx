import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";
import PlacePhotoImage from "./PlacePhotoImage";

const HotelCard = ({ item, locationHint, staggerIndex = 0 }) => {
  return (
    <View style={{ marginRight: 20, width: 180 }}>
      <PlacePhotoImage
        name={item?.name}
        locationHint={locationHint}
        address={item?.address}
        imageUrl={item?.image_url}
        staggerIndex={staggerIndex}
        style={{
          width: 180,
          height: 120,
          borderRadius: 15,
        }}
        loaderStyle={{ height: 120, justifyContent: "center" }}
      />
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
