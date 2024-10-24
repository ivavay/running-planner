// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebase_api_key = import.meta.env.VITE_FIREBASE_API_KEY;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: firebase_api_key,
  authDomain: "running-planner-e19b8.firebaseapp.com",
  projectId: "running-planner-e19b8",
  storageBucket: "running-planner-e19b8.appspot.com",
  messagingSenderId: "815305177022",
  appId: "1:815305177022:web:1ac4a8b09c5963f19eabef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const fireAuth = getAuth(app);
const fireDb = getFirestore(app);

export { fireAuth, fireDb, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut };

