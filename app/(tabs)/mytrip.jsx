import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import StartNewTripCard from "@/componets/MyTrips/StartNewTripCard";
import { db, auth } from "../../configs/FirebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import UserTripList from "@/componets/MyTrips/UserTripList";
import { useRouter } from "expo-router";
export default function MyTrip() {
  const [userTrips, setUserTips] = useState([]);
  const user = auth.currentUser;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    user && GetMyTrip();
  }, [user]);
  const GetMyTrip = async () => {
    setLoading(true);
    setUserTips([]);
    const q = query(
      collection(db, "UserTrip"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      setUserTips((prev) => [...prev, doc.data()]);
    });
    setLoading(false);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <ScrollView
        style={{
          flex: 1,
          padding: 25,
          paddingTop: 50,
          backgroundColor: Colors.WHITE,
          height: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 35, fontFamily: "outfit-bold" }}>
            MyTrips
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/create-trip/search-place")}
          >
            <Ionicons name="add-circle" size={50} color="black" />
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size={"large"} color={Colors.PRIMARY} />}
        {userTrips?.length === 0 ? (
          <StartNewTripCard />
        ) : (
          <UserTripList userTrips={userTrips} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
