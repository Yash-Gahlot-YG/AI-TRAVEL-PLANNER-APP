import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { BlurView } from "expo-blur";

export default function GlassyCard() {
  return (
    <View style={styles.container}>
      {/* <Image
        source={{ uri: "https://example.com/building.jpg" }}
        style={styles.backgroundImage}
      /> */}
      {/* <BlurView intensity={1000} style={styles.glassCard}> */}
      <View style={{ padding: 100 }}>
        <Text>Devloping Mode</Text>
      </View>
      {/* </BlurView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  glassCard: {
    width: "90%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  location: {
    fontSize: 16,
    color: "#ccc",
    marginVertical: 5,
  },
  description: {
    fontSize: 14,
    color: "#eee",
    marginBottom: 15,
  },
  features: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  feature: {
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 20,
    color: "#fff",
  },
  featureText: {
    fontSize: 12,
    color: "#fff",
    marginTop: 5,
  },
});
