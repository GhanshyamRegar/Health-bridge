import { collection, getDocs, query, where } from 'firebase/firestore'
import React from 'react'
import { db } from '../../firebase';

const Getcomdetail = async (userId) => {
  console.log(userId);
  try {
    const communitycollection = collection(db,'community');
    const q = query(communitycollection, where('creatorId','==',userId));
    const querySnapshot = await getDocs(q);

    const communitydata = [];
    
    if (!querySnapshot.empty) {
      querySnapshot.forEach(doc => {
        const commData  = doc.data();
        const commId = doc.id;
        communitydata.push({ id: commId, data: commData });
      });

      return communitydata;
    } else {
      console.log("No matching documents.");
      return null; // or return an empty array or object, depending on your requirements
    }
  } catch (err) {
    console.error("Error fetching community data:", err);
    return null; // or handle the error in your UI as needed
  }
};

export default Getcomdetail;
