import React, { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { CreateTripContext } from "./../../context/CreateTripContext";
import {
  fetchPlaceSuggestions,
  fetchPlaceDetailsById,
  getPlaceApiKeyCount,
  getActivePlaceApiKeyCount,
} from "../../services/GooglePlaceApi";

const DEBOUNCE_MS = 500;

export default function SearchPlace() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext) || {};
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchId = useRef(0);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "Search",
    });
  }, []);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const runSearch = async (inputText: string) => {
    const currentSearch = ++searchId.current;

    if (!getPlaceApiKeyCount()) {
      setErrorMessage(
        "Place API keys missing. Add EXPO_GOOGLE_PLACE_KEYS in .env and restart Expo."
      );
      setSearching(false);
      return;
    }

    setSearching(true);
    const { predictions, error } = await fetchPlaceSuggestions(inputText);

    if (currentSearch !== searchId.current) {
      return;
    }

    setSuggestions(predictions);
    setSearching(false);

    if (error === "missing_key") {
      setErrorMessage(
        "Place API keys missing. Add EXPO_GOOGLE_PLACE_KEYS in .env and restart Expo."
      );
    } else if (error === "invalid_key") {
      setErrorMessage(
        `No working RapidAPI key. Subscribe to Google Map Places (New V2). Active keys: ${getActivePlaceApiKeyCount()}/${getPlaceApiKeyCount()}`
      );
    } else if (error === "rate_limit") {
      setErrorMessage(
        "Too many searches. Wait 30 seconds and try again (type slower)."
      );
    } else if (predictions.length === 0) {
      setErrorMessage("No places found. Try a different spelling.");
    } else {
      setErrorMessage("");
    }
  };

  const handleSearch = (inputText: string) => {
    setQuery(inputText);
    setErrorMessage("");

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (!inputText.trim()) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    if (inputText.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(() => {
      runSearch(inputText.trim());
    }, DEBOUNCE_MS);
  };

  const fetchPlaceDetails = async (placeId: string) => {
    const details = await fetchPlaceDetailsById(placeId);

    if (!details) {
      setErrorMessage("Could not load place details. Try again in a moment.");
      return;
    }

    setTripData({
      ...tripData,
      locationInfo: {
        name: details.name,
        coordinates: details.geometry?.location,
        photoRef: details.photos?.[0]?.photo_reference,
        url: details.url,
      },
    });
    router.push("/create-trip/select-traveler");
  };

  const handleSelectSuggestion = (place: { description: string; place_id: string }) => {
    setQuery(place.description);
    setSuggestions([]);
    fetchPlaceDetails(place.place_id);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for a location"
        value={query}
        onChangeText={handleSearch}
      />

      {searching ? (
        <Text style={styles.hintText}>Searching...</Text>
      ) : null}

      {suggestions.length > 0 && (
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

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
    </View>
  );
}

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
  hintText: {
    color: Colors.GRAY,
    textAlign: "center",
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});
