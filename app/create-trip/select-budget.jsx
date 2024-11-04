import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { SelectBudgetOptions } from "../../constants/Options";
import OptionCard from "../../componets/CreateTrip/OptionCard";
import { CreateTripContext } from "./../../context/CreateTripContext";

const SelectBudget = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  useEffect(() => {
    selectedOption &&
      setTripData({
        ...tripData,
        budget: selectedOption?.title,
        desc: selectedOption?.desc,
      });
  }, [selectedOption]);
  const onCickContinue = () => {
    if (!selectedOption) {
      ToastAndroid.show("Select Your Budget", ToastAndroid.LONG);
      return;
    }
    router.push("/create-trip/review-trip");
  };
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 35,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <Text style={{ fontFamily: "outfit-bold", fontSize: 35, marginTop: 52 }}>
        Budget
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text
          style={{ fontFamily: "outfit-bold", fontSize: 17, marginBottom: 30 }}
        >
          Choose sepending habits for your trip
        </Text>

        <FlatList
          data={SelectBudgetOptions}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedOption(item)}
              style={{ marginVertical: 5 }}
            >
              <OptionCard option={item} selectedOption={selectedOption} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          onCickContinue();
        }}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 35,
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

export default SelectBudget;

const styles = StyleSheet.create({});
