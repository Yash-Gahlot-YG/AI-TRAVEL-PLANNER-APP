import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("auth/sign-in");
  };

  return (
    <View style={styles.wrapper}>
      <Image
        source={require("../assets/images/img10.jpg")}
        style={styles.image}
      />
      <View style={styles.container}>
        <Image
          source={require("./../assets/images/logoicon.jpg")}
          style={{
            height: 50,
            width: 50,
            borderRadius: 15,
            alignSelf: "center",
            justifyContent: "center",
            marginTop: -25,
            marginBottom: -3,
            flexDirection: "row",
          }}
        />
        <Text style={styles.title}>SmartTrip AI</Text>
        <Text style={styles.description}>
          Discover your next adventure effortlessly. Personalized itineraries at
          your fingertips. Travel smarter with AI-driven insights.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  image: {
    flex: 3.2,
    width: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1.7,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: "center",
    marginTop: -27,
  },
  title: {
    marginTop: 3,
    fontSize: 28,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontFamily: "outfit",
    fontSize: 17,
    textAlign: "center",
    color: Colors.GRAY,
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 100,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.WHITE,
    textAlign: "center",
    fontFamily: "outfit",
    fontSize: 17,
  },
});

export default Login;
