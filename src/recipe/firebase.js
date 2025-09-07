
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC19NHkAffxnQ2Vg5MnkYLbhBTGuyzsOy8",
  authDomain: "nutrition-tracker-3094e.firebaseapp.com",
  projectId: "nutrition-tracker-3094e",
  storageBucket: "nutrition-tracker-3094e.firebasestorage.app",
  messagingSenderId: "219753661883",
  appId: "1:219753661883:web:2259aa531b397be3fb309e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);