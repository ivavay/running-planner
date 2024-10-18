import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import promo1 from "../../assets/promo-1.png";
import promo2 from "../../assets/promo-2.png";
import StravaLogo from "../../assets/strava-logo.png";
import Calendar from "../../components/Calendar";
import RaceForm from "../../components/RaceForm";
import WeeklyDistance from "../../components/WeeklyDistance";
import { createProgram, fetchEvents, getRaceInfo } from "../../services/api";
import { fireAuth, fireDb } from "../../services/firebase";

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
  const [programCreated, setProgramCreated] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

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
      // set programCreated to true
      setProgramCreated(true);
    });
  }

  // Function to delete program from firebase
  function handleDeleteProgram(programId) {
    // Delete program from firestore
    const programRef = doc(fireDb, "programs", programId);
    // Delete the document
    setConfirmDeleteModal(true);
    deleteDoc(programRef)
      .then(() => {
        // Remove program from programs state
        setPrograms((prevPrograms) =>
          prevPrograms.filter((program) => program.id !== programId)
        );
        // Remove program from programRaceInfo state
        const updatedProgramRaceInfo = { ...programRaceInfo };
        delete updatedProgramRaceInfo[programId];
        setProgramRaceInfo(updatedProgramRaceInfo);
        // Reset active program ID
        setActiveProgramId(null);
        setConfirmDeleteModal(false);
      })
      .catch((error) => {
        console.error("Error deleting program: ", error);
      });
  }

  async function fetchUserPrograms(userId) {
    try {
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

  // Function to handle program selection
  function handleProgramSelect(programId) {
    setActiveProgramId(programId); // Set the selected program ID in state
    fetchEvents(programId).then((eventsData) => {
      setEventsData(eventsData);
    });
  }

  useEffect(() => {
    // Check if user is logged in, if so, set user state
    const unsubscribe = fireAuth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        fetchUserPrograms(user.uid);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {user ? (
        <div>
          <WelcomeHeader>Welcome, {user.displayName}</WelcomeHeader>
          <CreateProgramBtn onClick={handleCreateProgram}>
            Create new program
          </CreateProgramBtn>
          <ProgramsContainer>
            <h3>Select existing program</h3>
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
      {user && confirmDeleteModal && (
        <DeleteModal>
          <h3>Are you sure you want to delete this program?</h3>
          <ButtonOptions>
            <button onClick={() => setConfirmDeleteModal(false)}>Cancel</button>
            <button
              className="delete"
              onClick={() => handleDeleteProgram(activeProgramId)}
            >
              Confirm Delete
            </button>
          </ButtonOptions>
        </DeleteModal>
      )}
      {user && (
        <RaceForm
          setConfirmDeleteModal={setConfirmDeleteModal}
          handleCreateProgram={handleCreateProgram}
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
          programCreated={programCreated}
          setProgramCreated={setProgramCreated}
          programs={programs}
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
      <Footer>
        <FooterNote>
          Note: If not connected Strava, cannot utilize the full features of the
          app.
        </FooterNote>
        <FooterLogo src={StravaLogo} alt="Strava Logo" />
      </Footer>
    </>
  );
}

const ButtonOptions = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const FooterNote = styled.p`
  color: #333;
  font-size: 12px;
  @media (max-width: 768px) {
    display: none;
  }
`;
const DeleteModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  button {
    background-color: #333;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    margin-top: 24px;
  }
  button.delete {
    background-color: #ee5c5c;
  }
`;
const FooterLogo = styled.img`
  width: 200px;
  height: auto;
  margin: 16px;
`;
const Footer = styled.footer`
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align--items: center;
    justify-content: center;
  }
`;
const Images = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PromoImage = styled.img`
  width: 75%;
  height: auto;
  margin: 16px 10px;
  @media (max-width: 768px) {
    margin-top: 24px;
    width: 100%;
  }
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
  margin-bottom: 80px;

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

  h3 {
    margin-top: 40px;
    color: #333;
  }
  @media (max-width: 768px) {
    ul {
      display: flex;
      flex-direction: column;
    }
  }
`;
const ProgramButton = styled.button`
  background-color: ${(props) => (props.active ? "#333" : "#f0f0f0")};
  color: ${(props) => (props.active ? "#fff" : "#333")};
  border-radius: 4px;
  padding: 10px 20px;
  margin: 5px;
`;
