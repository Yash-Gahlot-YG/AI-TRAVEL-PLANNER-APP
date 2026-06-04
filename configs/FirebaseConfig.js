import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDpMDVwFgsIhLsxXBd6eQ1Jc6ZShnzFovA",
  authDomain: "smarttrip-ai-3d75e.firebaseapp.com",
  projectId: "smarttrip-ai-3d75e",
  storageBucket: "smarttrip-ai-3d75e.firebasestorage.app",
  messagingSenderId: "65714825787",
  appId: "1:65714825787:web:52f814187807a2abedca1e",
  measurementId: "G-FLT6SGQ73G",
};

export const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

export const db = getFirestore(app);

export const analytics =
  Platform.OS === "web"
    ? require("firebase/analytics").getAnalytics(app)
    : null;
