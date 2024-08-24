import React, { useEffect, useState } from 'react';
import { db } from '../../firebase'; // Import your initialized Firebase instance
import Navigation from '../../components/Navigation'
import { arrayUnion, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Joincommunity = ({userId,userdata}) => {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'community'));
        const communityData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCommunities(communityData);
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);
  

  
  const handleJoinCommunity = async( communityId) => {
    try {
    
      // Reference to the user document in Firestore
      const userRef = doc(db, 'users', userId);
  
      // Update the user document to join the community
      await updateDoc(userRef, {
        communities: arrayUnion(communityId) // Add the community ID to the 'communities' array
      });


      console.log(`User joined community ${communityId}`);
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };

  return (
    <div className="lrhandler">
      <Navigation userId={userId} userdata={userdata}/>
      <div className="join-community">
        <h2>Communities</h2>
        <ul className="join-community-list">
          {communities.map(community => (
            <li key={community.id} className="join-community-item">
              <div className="join-community-details">
                <img src={community.communitilogo} alt={community.name} className="join-community-logo" />
                <div className="join-community-info">
                  <h4>{community.name}</h4>
                  <p>{community.communitydesc}</p>
                  <p>Created by: {community.creatorname}</p>
                </div>
              </div>
              <Link to={`/dashboard/${community.id}`}>
                <button className="join-button" onClick={() => handleJoinCommunity(community.id)}>Join</button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Joincommunity;
