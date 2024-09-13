// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-oxUc78lO6PYgtdsLPfHMyku5ax5B8t0",
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

export { fireAuth, fireDb };