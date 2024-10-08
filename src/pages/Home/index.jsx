import Calendar from "../../components/Calendar";
import RaceForm from "../../components/RaceForm";
import WeeklyDistance from "../../components/WeeklyDistance";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import {
  fireDb,
  fireAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "../../firebase";
import { useEffect, useState } from "react";
import { fetchEvents, createProgram, getRaceInfo } from "../../../api";
import styled from "styled-components";
import promo1 from "../../assets/promo-1.png";
import promo2 from "../../assets/promo-2.png";

export default function Home() {
  const [weeklyDistances, setWeeklyDistances] = useState([]);
  const [programLength, setProgramLength] = useState(0);
  const [eventModal, setEventModal] = useState(false);
  const [programStartDate, setProgramStartDate] = useState("");
  const [programEndDate, setProgramEndDate] = useState("");
  const [programs, setPrograms] = useState([]);
  const [activeProgramId, setActiveProgramId] = useState(null);
  const [user, setUser] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  const [raceName, setRaceName] = useState("");
  const [raceDate, setRaceDate] = useState("");
  const [raceGoal, setRaceGoal] = useState("");
  const [raceInfo, setRaceInfo] = useState(null);
  const [programRaceInfo, setProgramRaceInfo] = useState({});

  function handleCreateProgram() {
    createProgram(user.uid).then((newProgramId) => {
      setPrograms((prevPrograms) => [...prevPrograms, newProgramId]);
      setActiveProgramId(newProgramId);
      // Reset race info and inputs
      setRaceInfo(null);
      setRaceName("");
      setRaceDate("");
      setRaceGoal("");
      // Reset program start and end dates
      setProgramStartDate("");
      setProgramEndDate("");

      fetchEvents(newProgramId).then((eventsData) => {
        setEventsData(eventsData);
      });
    });
  }

  useEffect(() => {
    console.log("useEffect running");
    // Check if user is logged in, if so, set user state
    const unsubscribe = fireAuth.onAuthStateChanged(async (user) => {
      console.log(user.uid);
      if (user) {
        console.log("User signed in:", user.displayName);
        setUser(user);
        fetchUserPrograms(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  async function fetchUserPrograms(userId) {
    try {
      console.log("Fetching programs for userId:", userId);
      // Fetch programs where user_id matches the logged-in user's ID
      const q = query(
        collection(fireDb, "programs"),
        where("user_id", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      let programs = [];
      let raceInfo = {};
      for (const doc of querySnapshot.docs) {
        const programId = doc.id;
        programs.push(programId);
        const raceData = await getRaceInfo(programId);
        console.log("Race data:", raceData);
        raceInfo[programId] = raceData
          ? raceData.race.race_name
          : "No Race Info";
      }
      setPrograms(programs);
      setProgramRaceInfo(raceInfo);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  }

  // I want the url to be the current url of the page
  // const dynamicURL = window.location.href;
  // console.log("Dynamic URL:", dynamicURL);
  // function handleSignIn() {
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(fireAuth, provider)
  //     .then((result) => {
  //       // Handle successful sign-in
  //       console.log("User signed in:", result.user.displayName);
  //       // Redirect to Strava OAuth page
  //       const stravaOauthURL = `https://www.strava.com/oauth/authorize?client_id=134373&response_type=code&redirect_uri=${dynamicURL}authorize&scope=read,activity:read&approval_prompt=force`;
  //       window.location.href = stravaOauthURL;
  //       // Add logged in user to firestore database if they don't already exist
  //       return addDoc(collection(fireDb, "users"), {
  //         name: result.user.displayName,
  //         email: result.user.email,
  //       });
  //     })

  //     .catch((error) => {
  //       // Handle errors
  //       console.error("Error signing in:", error);
  //     });
  //   // Signout user
  //   signOut(fireAuth);
  // }

  // Function to handle program selection
  function handleProgramSelect(programId) {
    setActiveProgramId(programId); // Set the selected program ID in state
    fetchEvents(programId).then((eventsData) => {
      setEventsData(eventsData);
    });
  }

  // Rerender the entire component when activeProgramId changes
  useEffect(() => {
    console.log("Active Program ID:", activeProgramId);
  }, [activeProgramId]);

  return (
    <>
      {user ? (
        <div>
          <WelcomeHeader>Welcome, {user.displayName}</WelcomeHeader>
          <CreateProgramBtn onClick={handleCreateProgram}>
            Create new program
          </CreateProgramBtn>
          <ProgramsContainer>
            <ul>
              {programs.map((programId) => (
                <li key={programId}>
                  <ProgramButton
                    onClick={() => handleProgramSelect(programId)}
                    active={activeProgramId === programId}
                  >
                    {programRaceInfo[programId]}
                  </ProgramButton>
                </li>
              ))}
            </ul>
          </ProgramsContainer>
        </div>
      ) : (
        <>{/* <Button onClick={handleSignIn}>Sign In with Google</Button> */}</>
      )}
      {!user && (
        <Images>
          <PromoImage src={promo1}></PromoImage>
          <PromoImage src={promo2}></PromoImage>
        </Images>
      )}
      {user && (
        <RaceForm
          activeProgramId={activeProgramId}
          programLength={programLength}
          setProgramLength={setProgramLength}
          programStartDate={programStartDate}
          setProgramStartDate={setProgramStartDate}
          setProgramEndDate={setProgramEndDate}
          programEndDate={programEndDate}
          user={user}
          setRaceDate={setRaceDate}
          setRaceGoal={setRaceGoal}
          setRaceName={setRaceName}
          setRaceInfo={setRaceInfo}
          raceDate={raceDate}
          raceGoal={raceGoal}
          raceName={raceName}
          raceInfo={raceInfo}
          programRaceInfo={programRaceInfo}
        />
      )}
      {user && (
        <WeeklyDistance
          activeProgramId={activeProgramId}
          user={user}
          programLength={programLength}
          weeklyDistances={weeklyDistances}
          setWeeklyDistances={setWeeklyDistances}
        />
      )}

      {user && (
        <Calendar
          activeProgramId={activeProgramId}
          user={user}
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

const Images = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PromoImage = styled.img`
  width: 75%;
  height: auto;
  margin: 16px 10px;
`;

const WelcomeHeader = styled.h1`
  color: #333;
  padding: 24px 0;
`;
const CreateProgramBtn = styled.button`
  background-color: #333;
  font-weight: 700;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
`;
const ProgramsContainer = styled.div`
  margin-top: 16px;

  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: flex-start;
  }
  li {
    margin-bottom: 8px;
    margin-right: 16px;
  }
`;
const ProgramButton = styled.button`
  background-color: ${(props) => (props.active ? "#808080" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  border-radius: 4px;
  padding: 10px 20px;
  margin: 5px;
  &:hover {
    background-color: ${(props) => (props.active ? "#808080" : "#ddd")};
  }
`;
