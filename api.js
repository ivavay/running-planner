import { fireDb } from './src/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const client_id = import.meta.env.VITE_STRAVA_CLIENT_ID;
const client_secret = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_STRAVA_REFRESH_TOKEN;

export async function saveEvent(event, programId) {
    try {
        const programIdFormatted = String(programId);
        const docRef = collection(fireDb, "programs", programIdFormatted, "events");
        await addDoc(docRef, event);
        return docRef.id;
      } catch (error) {
        console.error("Error adding document: ", error);
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

  const perPage = 30
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
  
  const json = await response.json();
 // If status is okay, return the JSON data with just the run activies 
  return json 
}


// export async function fetchRunsFromAPI(accessToken, startDate, endDate) {
//     try {
//         const response = await fetch(
//             `https://www.strava.com/api/v3/athlete/activities`,
//             {
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                   },
//                   params: {
//                     before: Math.floor(new Date(endDate).getTime() / 1000), 
//                     after: Math.floor(new Date(startDate).getTime() / 1000), 
//                     per_page: 100,
//                   },
//             },
            
//         );
//         const activities = await response.json()
//         console.log("API Response Data: ", activities); 
//         const run = activities.find((activity) => {
//             const activityDate = new Date(activity.start_date_local);
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             return activity.type === 'Run' && activityDate >= start && activityDate <= end;
//           });
    
//         if (run) {
//             const distanceInMeters = run.distance / 1000; 
//             const distanceRounded = (distanceInMeters).toFixed(1); 
//             return parseFloat(distanceRounded); 
//         } else {
//             console.log('No run found on that dates ' + startDate, endDate);
//             return null;
//           }
        
//         } catch (error) {
//             console.
//             error("Error fetching runs: ", error);
//         }

// }