export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    desc: "Solo adventure and discovery.",
    icon: "🌍",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Shared journey for two.",
    icon: "❤️",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "Fun-filled family getaway.",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friends",
    desc: "Thrills and memories with friends.",
    icon: "🎉",
    people: "5 to 10 People",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Focus on cost-saving options",
    icon: "💸", // Icon represents lower spending
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Balance cost and comfort",
    icon: "💵", // Icon represents average spending
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Dont worry about cost",
    icon: "💰", // Icon represents higher spending
  },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location : {location}, for {totalDays} Days and {totalNight} Night for {traveler} with a {budget} budget with a Flight details, Flight Price with Booking url, Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates (latitude and longitude accurate to 6 decimal places), rating,descriptions and Places to visit nearby with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time t travel each of the location for {totalDays} days and {totalNight} night with each day plan with best time to visit in JSON format.";

export const apiKey = "AIzaSyA4JN5uI7Tgt4XqLYtn0fk8_QMPUqyHozg";
