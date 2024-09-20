import { fireDb } from './src/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default async function saveEvent(event, programId) {
    try {
        const programIdFormatted = String(programId);
        const docRef = collection(fireDb, "programs", programIdFormatted, "events");
        await addDoc(docRef, event);
        return docRef.id;
      } catch (error) {
        console.error("Error adding document: ", error);
      }
}
