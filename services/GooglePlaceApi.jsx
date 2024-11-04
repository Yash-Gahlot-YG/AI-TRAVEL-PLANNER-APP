import axios from "axios";
import {
  EXPO_GOOGLE_MAP_KEY1,
  EXPO_GOOGLE_MAP_KEY_479,
  EXPO_GOOGLE_PLACE_KEY_SAYMYNAME,
} from "@env";

export const GetPhotoRef = async (placeName) => {
  const options = {
    method: "GET",
    url: "https://google-map-places.p.rapidapi.com/maps/api/place/textsearch/json",
    params: {
      query: placeName,
      radius: "1000",
      opennow: "true",
      location: "40,-110",
      language: "en",
      region: "en",
    },
    headers: {
      "x-rapidapi-key": "1f75bbd16bmsh23e846fd974cb4cp190e85jsn29da75d29439",
      "x-rapidapi-host": "google-map-places.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data); // Log the response data to the terminal
    return response.data; // Return the API response data
  } catch (error) {
    console.error("Error fetching photo ref:", error); // Log any errors
  }
};
