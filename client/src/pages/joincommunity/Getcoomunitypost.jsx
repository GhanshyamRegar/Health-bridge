import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firestore instance from the firebase file

const Getcommunitypost = async (communityId) => {

    

  try {
    // Create a query to fetch posts where userId matches
    const ref = collection(db, 'post');
    const q = query(ref,where("communityId","==",communityId))
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

export default Getcommunitypost;
