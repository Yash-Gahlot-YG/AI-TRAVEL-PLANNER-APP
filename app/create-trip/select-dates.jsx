import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { CreateTripContext } from "./../../context/CreateTripContext";

const SelectDates = () => {
  const navigation = useNavigation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  const onDateChange = (date, type) => {
    if (type === "START_DATE") {
      setStartDate(moment(date)); // Update startDate with the selected start date
      setEndDate(null); // Reset the end date if selecting a new start date
    } else {
      setEndDate(moment(date)); // Update endDate with the selected end date
    }
  };
  const OnDateSelectionContinue = () => {
    // Validate if both dates are selected
    if (!startDate && !endDate) {
      ToastAndroid.show(
        "Please select both Start and End Date",
        ToastAndroid.LONG
      );
      return;
    }

    // Calculate the difference in days
    const totalNoOfDays = endDate.diff(startDate, "days");
    console.log(totalNoOfDays + 1); // Add 1 to include the start date in the count
    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays + 1,
    });
    router.push("/create-trip/select-budget");
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
        Travel Dates
      </Text>
      <View style={{ marginTop: 35 }}>
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={4}
          selectedRangeStyle={{ backgroundColor: Colors.PRIMARY }}
          selectedDayTextStyle={{ color: Colors.WHITE }}
        />
      </View>
      <TouchableOpacity
        onPress={OnDateSelectionContinue}
        style={{
          padding: 15,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          marginTop: 35,
          width: "95%",
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

export default SelectDates;

const styles = StyleSheet.create({});
