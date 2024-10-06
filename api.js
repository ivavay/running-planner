import { fireAuth, fireDb } from './src/firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, setDoc, getDoc, doc, addDoc, getDocs, where, query, deleteDoc } from 'firebase/firestore';

const client_id = import.meta.env.VITE_STRAVA_CLIENT_ID;
const client_secret = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_STRAVA_REFRESH_TOKEN;

// Fix this to fetch events from Firestore based on logged in user id
// Events are stored in a collection called "events" under program document

// I want the program ID to be created in the create program function, not upon saving program length in the race form 
// So that I can have separation of concerns 

// Function to get the active program ID from local storage
export function getActiveProgramId() {
  return localStorage.getItem('activeProgramId');
}

// Function to get the logged-in user's program ID
export function getProgramId() {
  return new Promise((resolve, reject) => {
    const activeProgramId = getActiveProgramId();
    if (activeProgramId) {
      resolve(activeProgramId);
    } else {
      onAuthStateChanged(fireAuth, async (user) => {
        if (user) {
          const userId = user.uid;
          try {
            // Query the program document where user_id matches the logged-in user's ID
            const q = query(collection(fireDb, "programs"), where("user_id", "==", userId));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const programDoc = querySnapshot.docs[0];
              const programId = programDoc.id;
              resolve(programId);
            } else {
              reject("No program found for the user.");
            }
          } catch (error) {
            reject(error);
          }
        } else {
          reject("No user is signed in.");
        }
      });
    }
  });
}

export async function createProgram(userId) {
  try {
    const programsRef = collection(fireDb, "programs");
    const newProgramRef = doc(programsRef); // Generates a new document reference with a unique ID

    // Set the new program document with default values
    await setDoc(newProgramRef, {
      program_id: newProgramRef.id,
      user_id: userId,
      program_length: {
        start_date: null,
        end_date: null,
      },
    });

    console.log("Program created successfully with program ID:", newProgramRef.id);
    return newProgramRef.id;
  } catch (error) {
    console.error("Error creating program: ", error);
    throw error;
  }
}

// Save race info to Firestore, which includes the race name, race date, and race goal 
export async function saveRaceInfo(raceName, raceDate, raceGoal, programId) {
  try {
    const programRef = doc(fireDb, "programs", programId);
    // Update race object in the Firestore document
    await setDoc(programRef, {
      race: {
        race_name: raceName,
        race_date: raceDate,
        race_goal: raceGoal,
      },
    }, { merge: true });
    console.log('Race info saved successfully.');
  } catch (error) {
    console.error("Error", error);
  }
}

// Retrieve race info from Firestore
export async function getRaceInfo(programId) {
  try {
    const programRef = doc(fireDb, "programs", programId);
    const programDoc = await getDoc(programRef);
    if (programDoc.exists()) {
      return programDoc.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    return null;
  }
}

// Retrieve program length data from Firestore
export async function getProgramLength(programId) {
  try {
    const programRef = doc(fireDb, "programs", programId);
    const programDoc = await getDoc(programRef);
    if (programDoc.exists()) {
      return programDoc.data().program_length;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting program length: ", error);
    return null;
  }
}

// Save program length data to Firestore
export async function saveProgramLength(programId, startDate, endDate) {
  try {
    const programRef = doc(fireDb, "programs", programId);

    // Update the program_length object in the Firestore document
    await setDoc(programRef, {
      program_length: {
        start_date: startDate,
        end_date: endDate,
      },
    }, { merge: true });


    console.log("Program length updated successfully.");
  } catch (error) {
    console.error("Error updating program length: ", error);
    throw error;
  }
}

// Save weekly distamce goals to Firestore 
export async function saveWeeklyDistances(weeklyDistances, programId) {
  try {
    // Access the program document directly using programId
    const programRef = doc(fireDb, "programs", programId);
   
    const programSnapshot = await getDoc(programRef);

    if (!programSnapshot.exists()) {
      console.log("Program document does not exist.");
      return;
    }

    // Get the existing week array
    const programData = programSnapshot.data();

    // Update the week array with the new weekly distances
    const updatedWeekArray = weeklyDistances.map((distance) => distance);

    // Save the updated week array back to Firestore
    await setDoc(programRef, { ...programData, week: updatedWeekArray });

    console.log("Weekly distances saved successfully.");
  } catch (error) {
    console.error("Error saving weekly distances: ", error);
  }

} 
export async function fetchWeeklyDistances(programId) {
  try {
    // Access the program document directly using programId
    const programRef = doc(fireDb, "programs", programId);
    const programSnapshot = await getDoc(programRef);

    if (!programSnapshot.exists()) {
      console.log("Program document does not exist.");
      return [];
    }

    // Get the program data
    const programData = programSnapshot.data();

    // Return the week array
    return programData.week || [];
  } catch (error) {
    console.error("Error fetching weekly distances: ", error);
    return [];
  }
}
export async function fetchEvents(programId) {
  try {
    // Access the events subcollection within the program document using programId
    const eventsRef = collection(fireDb, "programs", programId, "events");
    const eventsSnapshot = await getDocs(eventsRef);
    const events = eventsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    console.log(events);
    return events;
  } catch (error) {
    console.error("Error fetching events: ", error);
    return [];
  }
}

export async function saveEvent(eventInputs, programId) {
  try {

    const programIdFormatted = String(programId);
    const eventsCollectionRef = collection(fireDb, "programs", programIdFormatted, "events");

    if (eventInputs.id) {
      // If event ID exists, update the event
      const eventDocRef = doc(eventsCollectionRef, eventInputs.id);
      await setDoc(eventDocRef, eventInputs, { merge: true });
      return eventInputs.id;
    } else {
      // If event ID does not exist, create a new event
      const newEventDocRef = await addDoc(eventsCollectionRef, eventInputs);
      const newEventId = newEventDocRef.id;
      // Assign the new ID to the event object
      eventInputs.id = newEventId;
      return newEventId;
    }
  } catch (error) {
    console.error("Error saving event: ", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export async function deleteEvent(eventInputs, programId) {
  try {
    // If event ID is undefined or empty, throw an error
    if (!eventInputs.id || eventInputs.id === "") {
      throw new Error("Event ID is required to delete an event.");
    }

    const programIdFormatted = String(programId);
    const eventDocRef = doc(fireDb, "programs", programIdFormatted, "events", eventInputs.id);
    await deleteDoc(eventDocRef);

    console.log(`Event with ID ${eventInputs.id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}

// Gets a new access token from Strava using refresh token
export async function fetchData() {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  const body = {
    client_id: client_id,
    client_secret: client_secret,
    refresh_token: refresh_token,
    grant_type: 'refresh_token',
  }
  
  const reauthorizedResponse = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body),
  });

  const reauthorizedJSON = await reauthorizedResponse.json();
  const newAccessToken = reauthorizedJSON.access_token;
  // const newAccessToken = '946c9283e12ad99fcadab82850f24f665129df78'
  console.log('New Access Token: ', newAccessToken);
  console.log('ClientId: ', client_id);

  const perPage = 60
  // First-time Authorization 
  const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${newAccessToken}`,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch athlete activities: ${response.status} - ${errorText}`);
  }
  
  let json = await response.json();
  // Only return the run activities
  json = json.filter(activity => activity.type === 'Run');
 // If status is okay, return the JSON data with just the run activies 
  return json 
}

