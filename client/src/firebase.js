// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSwm_8RxrYZ9ahHAATd6HEzeQy13pYe9U",
  authDomain: "healthbridge1-2179d.firebaseapp.com",
  projectId: "healthbridge1-2179d",
  storageBucket: "healthbridge1-2179d.appspot.com",
  messagingSenderId: "939190029914",
  appId: "1:939190029914:web:898d3ca31e71d0fd391263"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=  getFirestore(app);
const imgdb = getStorage(app);
export {db, app,imgdb };
