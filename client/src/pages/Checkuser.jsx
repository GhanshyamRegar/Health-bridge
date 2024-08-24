import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Chackuser = async (userId) => {
    try {
      // Reference to the user document
      const userDocRef = doc(db, 'users', userId);
  
      // Fetch the document
      const userDocSnapshot = await getDoc(userDocRef);
  
      // Check if the document exists
      if (userDocSnapshot.exists()) {
        // User document exists
        return true;
      } else {
        // User document does not exist
        return false;
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
      // Handle error
      throw error;
    }
  };

  export default Chackuser
  