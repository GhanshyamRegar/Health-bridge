import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { arrayRemove, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Navigation = ({ userId, userdata }) => {
  const [communities, setCommunities] = useState([]);

  
  const fetchCommunityDetails = async () => {
    try {
      const userDocRef =doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() ) {
        const userData = userDoc.data();
        if (userData && userData.communities) {
          const communityDetails = [];

          // Iterate over the community IDs and fetch their details
          for (const communityId of userData.communities) {
            const communityDocRef = doc(db, 'community', communityId);
            const communityDoc = await getDoc(communityDocRef);

            if (communityDoc.exists()) {
              // If the community document exists, push its data to the communityDetails array
              communityDetails.push({ id: communityDoc.id, ...communityDoc.data() });
            } else {
              console.error(`Community document with ID ${communityId} does not exist.`);
            }
          }

          // Set the communities state with the fetched details
          setCommunities(communityDetails);
        }
      }
    } catch (error) {
      console.error('Error fetching community details:', error);
    }
  };
  
  useEffect(() => {
    if(userId)
    fetchCommunityDetails();

  }, [userId]);
  

  const removeCommunity = async (communityId) => {
    try {
      const userDocRef = doc(collection(db, 'users'), userId);
      await updateDoc(userDocRef, {
        communities: arrayRemove(communityId),
        useralertmsg:false,
        useralert:false,
      });
      fetchCommunityDetails();
    } catch (error) {
      console.error('Error removing community from user:', error);
    }
  };
  
  return (
    <div>
      <div className="navigation-left">
        <ul className="navigation-container">
          <li className="navigation-container-li">
            <Link to="/notify">Notifications</Link>
          </li>
          <li className="navigation-container-li">
            <Link to="/CreateCommunity">Create community</Link>
          </li>
          <li className="navigation-container-li">
            <Link to="/JoinCommunity">Join community</Link>
          </li>
          <li className="navigation-container-li"><Link to="/Activity">My Activity</Link></li>
          <li className="navigation-container-li"><Link to="/help">Want Help</Link></li>
          <li className="navigation-container-li">
            <h3>Communities</h3>
            <ol className='navigation-community-container'>
              {/* Map over the communities array and create options */}
              {communities.map((community, index) => (
                <li   key={index} value={community.id}>
                  <Link to={`/dashboard/${community.id}`} >
                    {community.name}
                  </Link>
                  <button className='remove' onClick={() => removeCommunity(community.id)}>Remove</button>
                </li>
              ))}
            </ol>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
