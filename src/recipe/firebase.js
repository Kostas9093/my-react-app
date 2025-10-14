
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut, updateProfile} from "firebase/auth";
import { getFirestore , doc, setDoc } from "firebase/firestore";



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
export const auth = getAuth(app);

export const signUpWithEmail = async (email, password, alias) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
 

  // Save alias in the user's profile
  await updateProfile(user, { displayName: alias });


  // (Optional) also store alias in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email,
    alias,
    createdAt: new Date()
  });

  return user;
};

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => signOut(auth);