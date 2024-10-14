import { collection, addDoc } from "firebase/firestore";
import {
  fireDb,
  fireAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../../firebase";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { fetchEvents } from "../../../api";

export default function Login() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = fireAuth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const eventsData = await fetchEvents(user.uid);
        console.log("User Id:", user.uid);
        console.log("User Events:", eventsData);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  function handleSignIn() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(fireAuth, provider)
      .then((result) => {
        // Handle successful sign-in
        console.log("User signed in:", result.user.displayName);
        // Add logged in user to firestore database only if they don't exist
        if (!user) {
          return addDoc(collection(fireDb, "users"), {
            name: result.user.displayName,
            email: result.user.email,
          });
        } else {
          console.log("User already exists in database, therefore not added");
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Error signing in:", error);
      });
    // Signout user
    signOut(fireAuth);
  }

  return (
    <div>
      <h1>Login</h1>
      {fireAuth.currentUser ? (
        <div>
          <p>Welcome, {fireAuth.currentUser.displayName}</p>
          <Button onClick={() => signOut(fireAuth)}>Sign Out</Button>
        </div>
      ) : (
        <Button onClick={handleSignIn}>Sign In with Google</Button>
      )}
    </div>
  );
}

const Button = styled.button``;
