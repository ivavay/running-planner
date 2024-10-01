import { fireDb } from './src/firebase.js';
import { collection, setDoc, doc, addDoc, getDocs, where, query, deleteDoc} from 'firebase/firestore';

const client_id = import.meta.env.VITE_STRAVA_CLIENT_ID;
const client_secret = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_STRAVA_REFRESH_TOKEN;

// Fix this to fetch events from Firestore based on logged in user id
// Events are stored in a collection called "events" under program document

export async function fetchEvents(userId) {
  try {
    // Query the programs collection to find the document with the matching user_id
    const programsRef = collection(fireDb, "programs");
    const q = query(programsRef, where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No program found for this user.");
      return [];
    }

    // Assuming there is only one program document per user
    const programDoc = querySnapshot.docs[0];
    const programId = programDoc.id;

    // Access the events subcollection within the program document
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

