import { fireDb } from './src/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default async function saveEvent(event, programId) {
    try {
        const eventId = String(event.id);
        const programIdFormatted = String(programId);
        // Construct the path to the events collection inside the specific program document
        const eventDocRef = doc(fireDb, "programs", programIdFormatted, "events", eventId);
        await setDoc(eventDocRef, event);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
}
