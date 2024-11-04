import React, { useState, useEffect, useContext } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "./../../context/CreateTripContext";
import {} from "./select-traveler";
import {
  EXPO_GOOGLE_PLACE_KEY,
  EXPO_GOOGLE_MAP_KEY_479,
  EXPO_GOOGLE_PLACE_KEY_SAYMYNAME,
} from "@env";

export default function SearchPlace() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext) || {}; // Added safe fallback

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Search",
    });
  }, []);

  useEffect(() => {
    console.log(tripData);
  }, [tripData]);

  // Function to fetch place suggestions from RapidAPI
  const fetchPlaceSuggestions = async (inputText) => {
    if (!inputText) return;

    try {
      const response = await axios.get(
        "https://google-map-places.p.rapidapi.com/maps/api/place/autocomplete/json",
        {
          params: {
            input: inputText,
            language: "en",
            region: "us", // Adjust region as per your requirement
          },
          headers: {
            "x-rapidapi-key":
              "b023ed67cfmsh8a80e388a2ec883p18c18cjsn9605c6077f0d", // Use your RapidAPI key
            "x-rapidapi-host": "google-map-places.p.rapidapi.com",
          },
        }
      );
      setSuggestions(response.data.predictions); // Store the autocomplete predictions
    } catch (error) {
      console.error("Error fetching places: ", error.message);
      setErrorMessage("Error fetching places. Please try again.");
    }
  };

  // Function to fetch place details from the selected place's place_id
  const fetchPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get(
        "https://google-map-places.p.rapidapi.com/maps/api/place/details/json",
        {
          params: {
            place_id: placeId,
            language: "en",
          },
          headers: {
            "x-rapidapi-key":
              "b023ed67cfmsh8a80e388a2ec883p18c18cjsn9605c6077f0d", // Use your RapidAPI key
            "x-rapidapi-host": "google-map-places.p.rapidapi.com",
          },
        }
      );

      const details = response.data.result;
      setTripData({
        ...tripData,
        locationInfo: {
          name: details.name,
          coordinates: details.geometry.location,
          photoRef: details.photos?.[0]?.photo_reference,
          url: details.url,
        },
      });
      router.push("/create-trip/select-traveler");
    } catch (error) {
      console.error("Error fetching place details: ", error.message);
      setErrorMessage("Error fetching place details. Please try again.");
    }
  };

  // Function to handle when a suggestion is selected
  const handleSelectSuggestion = (place) => {
    console.log("Selected place:", place);
    setQuery(place.description); // Update the input box with selected place
    setSuggestions([]); // Clear suggestions after selection

    // Fetch and log place details using place_id
    fetchPlaceDetails(place.place_id);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a location"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchPlaceSuggestions(text); // Fetch suggestions as user types
        }}
      />

      {/* Display suggestions if available */}
      {suggestions && suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Display error message if there's an error */}
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingTop: 100,
    backgroundColor: Colors.WHITE,
    height: "100%",
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 18,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
  },
  suggestionItem: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
