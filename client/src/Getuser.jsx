import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Import your Firestore instance from the firebase file

const Getuser = async (email) => {
  try {
    // Reference to the 'users' collection
    const usersCollection = collection(db, 'users');

    // Create a query to find the document where the email matches the provided email address
    const q = query(usersCollection, where('email', '==', email));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Check if there's a document with the provided email address
    if (!querySnapshot.empty) {
      // Get the first document (assuming email is unique)
      const userData = querySnapshot.docs[0].data();
      const userId = querySnapshot.docs[0].id;

      // Return the username from the user data
      return({userData,userId});
    } else {
      throw new Error('No user found with the specified email.');
    }
  } catch (error) {
    console.error('Error retrieving username:', error);
    throw error;
  }
};

export default Getuser;
