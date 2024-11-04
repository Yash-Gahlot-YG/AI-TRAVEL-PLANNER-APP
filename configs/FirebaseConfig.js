// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqJsB6Agu4w0IiPTHcWnU6w40eGBnz7GU",
  authDomain: "ai-travel-app-8d6cc.firebaseapp.com",
  projectId: "ai-travel-app-8d6cc",
  storageBucket: "ai-travel-app-8d6cc.appspot.com",
  messagingSenderId: "727463076465",
  appId: "1:727463076465:web:69243c818208f1dd0731d0",
  measurementId: "G-KYYKKZQHE8",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app); // Initialize analytics
export const db = getFirestore(app);
