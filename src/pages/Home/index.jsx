import Calendar from "../../components/Calendar";
import RaceForm from "../../components/RaceForm";
import WeeklyDistance from "../../components/WeeklyDistance";
import { collection, addDoc } from "firebase/firestore";
import {
  fireDb,
  fireAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../../firebase";
import { useEffect, useState } from "react";
import { fetchEvents } from "../../../api";
import styled from "styled-components";

export default function Home() {
  const [weeklyDistances, setWeeklyDistances] = useState([]);
  const [programLength, setProgramLength] = useState(0);
  const [eventModal, setEventModal] = useState(false);
  const [programStartDate, setProgramStartDate] = useState("");
  const [programEndDate, setProgramEndDate] = useState("");

  const [user, setUser] = useState(null);
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    // Check if user is logged in, if so, set user state
    const unsubscribe = fireAuth.onAuthStateChanged(async (user) => {
      console.log(user.uid);
      if (user) {
        setUser(user);
        const eventsData = await fetchEvents(user.uid);
        setEventsData(eventsData);
        console.log("Events Data:", eventsData);
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
        // Add logged in user to firestore database if they don't already exist
        return addDoc(collection(fireDb, "users"), {
          name: result.user.displayName,
          email: result.user.email,
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error signing in:", error);
      });
    // Signout user
    signOut(fireAuth);
  }

  return (
    <>
      {fireAuth.currentUser ? (
        <div>
          <h1>Welcome, {fireAuth.currentUser.displayName}</h1>
          <Button onClick={() => signOut(fireAuth)}>Sign Out</Button>
        </div>
      ) : (
        <>
          <h1>Home Page: Current program</h1>
          <Button onClick={handleSignIn}>Sign In with Google</Button>
        </>
      )}
      <RaceForm
        programLength={programLength}
        setProgramLength={setProgramLength}
        programStartDate={programStartDate}
        setProgramStartDate={setProgramStartDate}
        setProgramEndDate={setProgramEndDate}
        programEndDate={programEndDate}
      />
      <WeeklyDistance
        user={user}
        programLength={programLength}
        weeklyDistances={weeklyDistances}
        setWeeklyDistances={setWeeklyDistances}
      />
      {console.log("User ", user)}
      {user && (
        <Calendar
          userId={user.uid}
          eventsData={eventsData}
          programStartDate={programStartDate}
          programEndDate={programEndDate}
          programLength={programLength}
          eventModal={eventModal}
          setEventModal={setEventModal}
          weeklyDistances={weeklyDistances}
          setWeeklyDistances={setWeeklyDistances}
        />
      )}
    </>
  );
}

const Button = styled.button``;
