import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // Import your Firestore instance from the firebase file


const Setpost = async (formData) => { // Mark the function as async

  
  const postData = {
    title: formData.title,
    postimg: formData.postimg,
    postdesc: formData.postdesc,
    communityId:formData.communityId,
    communityname:formData.communityname,
    username:formData.username,
    userId: formData.userId ,
    role:formData.role
  };
  

  const postCollection = collection(db, 'post');

  // try {
    // Add a new document to the 'users' collection with the userData
    const docRef = await addDoc(postCollection, postData);
    console.log('Document written with ID: ', docRef.id);
    return console.log('Document written successfully'); // Return a success message
  // } 
  // catch (error) {
  //   console.error('Error adding document: ', error);
  //   return console.log('Error adding document', error); // Return an error message
  // }
}

export default Setpost;