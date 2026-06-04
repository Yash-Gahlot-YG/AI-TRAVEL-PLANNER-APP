import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "./../../context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { useRouter } from "expo-router";
import { db, auth } from "../../configs/FirebaseConfig";
import { generateTripPlan } from "../../configs/AiModal";
import {
  parseAiTripResponse,
  stripUndefinedForFirestore,
} from "../../utils/tripPlan";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import moment from "moment";

const Generatetrip = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // To store error messages for the user
  const router = useRouter();
  const user = auth.currentUser;

  const hasTriggered = useRef(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    console.log("Current Trip Data:", tripData);
    
    // Guard: Only generate if tripData is fully populated
    if (
      tripData &&
      tripData.locationInfo?.name &&
      tripData.totalNoOfDays &&
      tripData.traveler &&
      tripData.budget
    ) {
      if (!hasTriggered.current) {
        hasTriggered.current = true;
        checkAndGenerateTrip();
      }
    } else {
      console.log("Skipping generation: tripData is incomplete", tripData);
    }
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

      GenerateAitrip();
    } catch (error) {
      console.error("Error checking trip creation time:", error);
      setErrorMessage("An error occurred while checking trip creation time.");
    }
  };

  const GenerateAitrip = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
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
      const responseText = await generateTripPlan(FINAL_PROMPT);

      // Check if the response is empty
      if (!responseText || responseText.trim() === "") {
        throw new Error("Received empty response from AI.");
      }

      console.log("AI Response Text:", responseText);

      const tripResp = parseAiTripResponse(responseText);
      console.log("Parsed Trip Response:", tripResp);

      if (!user?.email) {
        throw new Error("You must be signed in to save a trip.");
      }

      // Generate a deterministic docId to prevent duplicate entries
      const startStr = tripData.startDate ? moment(tripData.startDate).format("YYYY-MM-DD") : "";
      const endStr = tripData.endDate ? moment(tripData.endDate).format("YYYY-MM-DD") : "";
      const docId = `${user.email}_${tripData.locationInfo.name}_${startStr}_${endStr}`.replace(/[^a-zA-Z0-9]/g, "_");

      const tripObj = {
        userEmail: user.email,
        tripPlan: tripResp,
        tripData: JSON.stringify(tripData),
        docId,
      };

      await setDoc(
        doc(db, "UserTrip", docId),
        stripUndefinedForFirestore(tripObj)
      );
      console.log("Document successfully written to Firestore!");

      // Update the throttle time only after successful generation
      try {
        await AsyncStorage.setItem("lastTripTime", Date.now().toString());
      } catch (storageErr) {
        console.error("Failed to write lastTripTime to AsyncStorage:", storageErr);
      }

      router.replace({
        pathname: "/trip-details",
        params: {
          trip: JSON.stringify(tripObj),
          photoRef: tripData?.locationInfo?.photoRef,
          flightDetails: JSON.stringify(tripResp?.flight),
        },
      });
    } catch (error) {
      console.error("AI Generation/Saving Error:", error);
      const message = error.message || "Something went wrong";
      if (message.includes("API_KEY_INVALID") || message.includes("API key not valid")) {
        setErrorMessage(
          "Gemini API key invalid. Get a new key from aistudio.google.com/apikey, paste in .env, then run: npx expo start -c"
        );
      } else if (
        message.includes("503") ||
        message.includes("high demand") ||
        message.includes("overloaded")
      ) {
        setErrorMessage(
          "AI server is busy. Please wait 1 minute and try again."
        );
      } else if (
        message.includes("permission") ||
        message.includes("PERMISSION_DENIED")
      ) {
        setErrorMessage(
          "Firestore blocked save. In Firebase Console → Firestore → Rules, allow signed-in users (see project README or chat)."
        );
      } else if (message.includes("Invalid JSON") || message.includes("JSON")) {
        setErrorMessage(
          "AI returned bad data. Tap back and generate the trip again."
        );
      } else {
        setErrorMessage(message);
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
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
