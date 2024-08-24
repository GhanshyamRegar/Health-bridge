import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase'; // Import your Firestore instance from the firebase file

const SetUser = async ({username, name, role, fileurl,exp, picurl, email, password, desc}) => { // Mark the function as async

  const userData = {
    username: username,
    name: name,
    role: role,
    email: email,
    password: password,
    desc: desc,
    profilepic: picurl

  };

  if (fileurl) {
    userData.file = fileurl; // Assigning file property directly to userData
    userData.exp=exp;
  }

  // alert("runned")
  const usersCollection = collection(db, 'users');
  
  try {
    const docRef = await addDoc(usersCollection, userData);
    console.log('Document written with ID: ', docRef.id);
    return 'Document written successfully'; // Return a success message
  } catch (error) {
    console.error('Error adding document: ', error);
    return 'Error adding document: ' + error.message; // Return an error message
  }
}

export default SetUser;
