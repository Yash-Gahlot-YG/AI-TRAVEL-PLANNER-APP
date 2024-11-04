import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SelectTravelesList } from "./../../constants/Options";
import OptionCard from "@/componets/CreateTrip/OptionCard";
// import { CreateTripContext } from "./../../context/CreateTripContext";
import { CreateTripContext } from "./../../context/CreateTripContext";

const SelectTraveler = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedTraveler, setSelectedTraveler] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  useEffect(() => {
    setTripData({ ...tripData, traveler: selectedTraveler });
  }, [selectedTraveler]);
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 35,
        backgroundColor: Colors.WHITE,
        height: "100%",
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 32, fontFamily: "outfit-bold", marginTop: 52 }}>
        Who's Traveling
      </Text>
      <View style={{ marginTop: 5 }}>
        <Text
          style={{ fontFamily: "outfit-bold", fontSize: 22, marginBottom: 20 }}
        >
          Choose your travelers
        </Text>

        {/* FlatList */}
        <FlatList
          data={SelectTravelesList}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedTraveler(item)}>
              <OptionCard option={item} selectedOption={selectedTraveler} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push("/create-trip/select-dates");
        }}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 17,
          width: "100%",
          justifyContent: "center",
          alignSelf: "center",
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            textAlign: "center",
            fontFamily: "outfit-medium",
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectTraveler;

const styles = StyleSheet.create({});
