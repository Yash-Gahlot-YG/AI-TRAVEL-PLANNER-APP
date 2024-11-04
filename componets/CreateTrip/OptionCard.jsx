import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "@/constants/Colors";

// OptionCard component that takes "option" as a prop
function OptionCard({ option, selectedOption }) {
  return (
    <View
      style={[
        {
          padding: 20,
          marginTop: 7,
          marginVertical: 10,
          borderRadius: 10,
          backgroundColor: "#f0f0f0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
        selectedOption?.id == option?.id && { borderWidth: 3 },
      ]}
    >
      <View>
        <Text style={styles.title}>{option?.title || "No Title"}</Text>
        <Text style={styles.description}>{option?.desc || "No Title"}</Text>
      </View>
      <Text style={styles.icon}>{option?.icon || "No Title"}</Text>
    </View>
  );
}
export default OptionCard;

const styles = StyleSheet.create({
  cardContainer: {},
  icon: {
    fontSize: 30, // Large icon size for visual clarity
  },
  title: {
    fontSize: 18, // Title font size
    fontFamily: "outfit-bold",
    marginTop: 5,
  },
  description: {
    fontSize: 14, // Description font size
    color: "#666",
  },
  people: {
    fontSize: 12, // People count font size
    color: "#888",
  },
});
