/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */
import { apiKey } from "../constants/Options";
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

import { EXPO_GOOGLE_GEMINI_API_KEY } from "@env";
// console.log(apiKey, "apikey");
// const apiKey = "AIzaSyANu1NR39NISpJeKqtxyxX90jTuU0pTLCY";
const genAI = new GoogleGenerativeAI(EXPO_GOOGLE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  // safetySettings: Adjust safety settings
  // See https://ai.google.dev/gemini-api/docs/safety-settings
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Travel Plan for Location : Las Vegas, for 2 Days and 1 Night for Friends with a Luxury budget with a Flight details, Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating,descriptions and Places to visit nearby with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for 2 days and 1 night with each day plan with best time to visit in JSON format.",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "flight": {\n    "details": {\n      "airline": "Southwest Airlines",\n      "departure_city": "Los Angeles, CA",\n      "arrival_city": "Las Vegas, NV",\n      "departure_date": "2023-10-27",\n      "return_date": "2023-10-29",\n      "flight_number": "WN2345",\n      "class": "Economy"\n    },\n    "price": "$250",\n    "booking_url": "https://www.southwest.com/flights/"\n  },\n  "hotels": [\n    {\n      "name": "The Venetian Resort Las Vegas",\n      "address": "3355 Las Vegas Blvd S, Las Vegas, NV 89109",\n      "price": "$350+",\n      "image_url": "https://www.thevenetianresort.com/content/dam/venetian/images/hero-images/venetian-hero.jpg",\n      "geo_coordinates": "36.1111,-115.1744",\n      "rating": 4.5,\n      "description": "A luxurious resort with a Venetian theme, featuring canals, gondolas, and a replica of St. Mark\'s Square."\n    },\n    {\n      "name": "The Bellagio",\n      "address": "3600 Las Vegas Blvd S, Las Vegas, NV 89109",\n      "price": "$400+",\n      "image_url": "https://www.bellagio.com/content/dam/bellagio/images/hero-images/bellagio-hero-desktop.jpg",\n      "geo_coordinates": "36.1146,-115.1729",\n      "rating": 4.7,\n      "description": "A world-renowned luxury hotel known for its botanical gardens, fountains, and fine dining."\n    },\n    {\n      "name": "The Wynn Las Vegas",\n      "address": "3131 Las Vegas Blvd S, Las Vegas, NV 89109",\n      "price": "$500+",\n      "image_url": "https://www.wynnlasvegas.com/content/dam/wynn/images/hero-images/wynn-hero-desktop.jpg",\n      "geo_coordinates": "36.1201,-115.1735",\n      "rating": 4.8,\n      "description": "A luxurious resort with a focus on entertainment, dining, and shopping."\n    }\n  ],\n  "itinerary": {\n    "day1": {\n      "morning": {\n        "time": "10:00 AM - 12:00 PM",\n        "location": {\n          "name": "The High Roller Observation Wheel",\n          "details": "Enjoy panoramic views of the Las Vegas Strip from the world\'s tallest observation wheel.",\n          "image_url": "https://www.caesars.com/content/dam/caesars/linq/the-high-roller/hero-images/hero-the-high-roller.jpg",\n          "geo_coordinates": "36.1099,-115.1731",\n          "ticket_pricing": "$35+",\n          "time_to_travel": "30 minutes"\n        }\n      },\n      "afternoon": {\n        "time": "1:00 PM - 4:00 PM",\n        "location": {\n          "name": "The Bellagio Conservatory & Botanical Garden",\n          "details": "Explore a stunning display of flowers and plants in a themed setting.",\n          "image_url": "https://www.bellagio.com/content/dam/bellagio/images/hero-images/conservatory-hero-desktop.jpg",\n          "geo_coordinates": "36.1146,-115.1729",\n          "ticket_pricing": "Free",\n          "time_to_travel": "1 hour"\n        }\n      },\n      "evening": {\n        "time": "7:00 PM - 10:00 PM",\n        "location": {\n          "name": "A Fine Dining Experience",\n          "details": "Enjoy a luxurious dinner at one of Las Vegas\'s many world-class restaurants.",\n          "image_url": "https://www.bellagio.com/content/dam/bellagio/images/restaurants/signature/picasso-hero-desktop.jpg",\n          "geo_coordinates": "36.1146,-115.1729",\n          "ticket_pricing": "Varies",\n          "time_to_travel": "1 hour"\n        }\n      }\n    },\n    "day2": {\n      "morning": {\n        "time": "10:00 AM - 12:00 PM",\n        "location": {\n          "name": "The Venetian and The Palazzo",\n          "details": "Explore the luxurious Venetian and Palazzo hotels, including the Grand Canal Shoppes and the Gondola Rides.",\n          "image_url": "https://www.thevenetianresort.com/content/dam/venetian/images/hero-images/venetian-hero.jpg",\n          "geo_coordinates": "36.1111,-115.1744",\n          "ticket_pricing": "Varies",\n          "time_to_travel": "2 hours"\n        }\n      },\n      "afternoon": {\n        "time": "1:00 PM - 4:00 PM",\n        "location": {\n          "name": "The Wynn and Encore",\n          "details": "Visit the Wynn and Encore hotels, known for their luxury shopping, fine dining, and entertainment.",\n          "image_url": "https://www.wynnlasvegas.com/content/dam/wynn/images/hero-images/wynn-hero-desktop.jpg",\n          "geo_coordinates": "36.1201,-115.1735",\n          "ticket_pricing": "Varies",\n          "time_to_travel": "2 hours"\n        }\n      },\n      "evening": {\n        "time": "7:00 PM - 10:00 PM",\n        "location": {\n          "name": "A Cirque du Soleil Show",\n          "details": "Experience the world-renowned Cirque du Soleil at one of their Las Vegas shows.",\n          "image_url": "https://www.cirquedusoleil.com/media/cache/site_images/cirque-du-soleil-o-show-image.jpg",\n          "geo_coordinates": "36.1146,-115.1729",\n          "ticket_pricing": "$100+",\n          "time_to_travel": "1 hour"\n        }\n      }\n    }\n  }\n}\n```\n\n**Notes:**\n\n* This is a sample itinerary and can be customized to your interests and preferences.\n* Flight prices are approximate and may vary depending on the time of year and availability.\n* Hotel prices are based on average nightly rates and may also vary depending on the season.\n* Ticket prices for attractions and shows are approximate and may vary depending on availability and date.\n* It is recommended to book flights and hotels in advance, especially during peak season.\n* Consider purchasing a Las Vegas Pass for discounted access to attractions.\n* Allow for additional time for transportation between locations.\n* Have a great time in Las Vegas!\n',
        },
      ],
    },
  ],
});

// const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
// console.log(result.response.text());
