import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "./../../context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { useRouter } from "expo-router";
import { db, auth } from "../../configs/FirebaseConfig";
import { chatSession, parts, apiKey } from "../../configs/AiModal";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Generatetrip = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // To store error messages for the user
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    console.log(tripData);
    tripData && checkAndGenerateTrip();
  }, [tripData]);

  const checkAndGenerateTrip = async () => {
    try {
      const lastTripTime = await AsyncStorage.getItem("lastTripTime");
      const currentTime = Date.now();

      // If a trip was created within the last minute, don't generate a new one
      if (lastTripTime && currentTime - parseInt(lastTripTime) < 60000) {
        setErrorMessage("You can only create a new trip once every minute.");
        return;
      }

      // Update the last trip creation time and proceed with generating the trip
      await AsyncStorage.setItem("lastTripTime", currentTime.toString());
      GenerateAitrip();
    } catch (error) {
      console.error("Error checking trip creation time:", error);
      setErrorMessage("An error occurred while checking trip creation time.");
    }
  };

  const GenerateAitrip = async () => {
    setLoading(true);
    setErrorMessage(null); // Reset any previous errors

    // Construct the prompt
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      tripData?.locationInfo.name
    )
      .replace("{totalDays}", tripData?.totalNoOfDays)
      .replace("{totalNight}", tripData?.totalNoOfDays - 1)
      .replace("{traveler}", tripData?.traveler?.title)
      .replace("{budget}", tripData?.budget)
      .replace("{totalDays}", tripData?.totalNoOfDays)
      .replace("{totalNight}", tripData?.totalNoOfDays - 1);

    console.log("FINAL_PROMPT:", FINAL_PROMPT);

    try {
      // Sending the AI prompt
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const responseText = await result.response.text(); // Ensure response is text

      // Check if the response is empty
      if (!responseText || responseText.trim() === "") {
        throw new Error("Received empty response from AI.");
      }

      console.log("AI Response Text:", responseText);

      // Determine if response is JSON by checking the first character
      let tripResp;
      if (
        responseText.trim().startsWith("{") ||
        responseText.trim().startsWith("[")
      ) {
        try {
          tripResp = JSON.parse(responseText);
          console.log("Parsed Trip Response:", tripResp);
        } catch (jsonError) {
          throw new Error("Invalid JSON format: " + jsonError.message);
        }
      } else {
        // Handle the response as plain text
        console.warn("AI response is not JSON, handling as plain text.");
        tripResp = { text: responseText };
      }

      // Now writing to Firestore
      const docId = Date.now().toString();
      await setDoc(doc(db, "UserTrip", docId), {
        userEmail: user.email,
        tripPlan: tripResp,
        tripData: JSON.stringify(tripData),
        docId: docId,
      });
      console.log("Document successfully written to Firestore!");
      router.push("(tabs)/mytrip");
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage(error.message); // Set error message to be displayed
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: "100%",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{ fontFamily: "outfit-bold", fontSize: 35, textAlign: "center" }}
      >
        Please Wait...
      </Text>
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 20,
          textAlign: "center",
          marginTop: 40,
        }}
      >
        Your trip is being generated by AI
      </Text>
      <Image
        source={require("./../../assets/images/bot.gif")}
        style={{
          width: "100%",
          height: 240,
          objectFit: "contain",
          marginTop: 30,
          paddingTop: 10,
        }}
      />
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 20,
          textAlign: "center",
          marginTop: 40,
          color: Colors.GRAY,
        }}
      >
        Do not Go Back
      </Text>
      {errorMessage && (
        <Text style={{ color: "red", marginTop: 20 }}>
          Error: {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default Generatetrip;
const styles = StyleSheet.create({});