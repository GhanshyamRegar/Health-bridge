import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firestore instance from the firebase file

const Getposts = async () => {

  try {
    // Create a query to fetch posts where userId matches
    const q = collection(db, 'post');
    const querySnapshot = await getDocs(q);
    
    const postsData = [];
    querySnapshot.forEach((doc) => {
      // Extract post data from each document

      postsData.push({id:doc.id,...doc.data()});
    });

    return postsData;
  } catch (error) {
    console.error('Error fetching posts: ', error);
    throw error;
  }
};

export default Getposts;
