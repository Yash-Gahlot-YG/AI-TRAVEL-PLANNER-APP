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
  'Generate a travel plan for Location: {location}, for {totalDays} Days and {totalNight} Night, traveler: {traveler}, budget: {budget}. Return ONLY valid JSON (no markdown). REQUIRED: "hotels" must be an array of exactly 3 to 5 different real hotels (not one). Each hotel object: {"name":"","address":"","price":"","image_url":"","geo_coordinates":"lat,lng","rating":0,"description":""}. Structure: {"flight":{"details":{"airline":"","departure_city":"","arrival_city":"","departure_date":"","return_date":"","flight_number":"","class":""},"price":"","booking_url":""},"hotels":[{hotel1},{hotel2},{hotel3}],"itinerary":{"day1":{"morning":{"time":"","location":{"name":"","details":"","image_url":"","geo_coordinates":"lat,lng","ticket_pricing":"","time_to_travel":""}},"afternoon":{"time":"","location":{}},"evening":{"time":"","location":{}}}}}. Use empty string "" for every image_url (never example.com). Include all days from day1 to day{totalDays} with morning, afternoon, evening for each day.';
