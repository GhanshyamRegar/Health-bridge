import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firestore instance from the firebase file

const Setcommunity = async (formData,userId) => {
  try {
    const commData = {
      name: formData.name,
      creatorname: formData.creatorname,
      creatorId: formData.creatorId,
      communitydesc: formData.communitydesc,
      communitilogo: formData.communitilogo 
    };

    // Add the community document to the 'community' collection
    const communityCollection = collection(db, 'community');
    const docRef = await addDoc(communityCollection, commData);

    console.log('Community document written with ID: ', docRef.id);

    // Update the corresponding user document with the newly created community ID
    const userDocRef = doc(db, 'users', userId);

    await updateDoc(userDocRef, {
      communities: arrayUnion(docRef.id)
    });

    console.log('User document updated with new community ID.');
    return 'Community created successfully';
  } catch (error) {
    console.error('Error creating community: ', error);
    return 'Error creating community: ' + error.message;
  }
};

export default Setcommunity;
