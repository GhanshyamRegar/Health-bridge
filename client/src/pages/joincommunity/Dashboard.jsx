// Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Navigation from '../../components/Navigation';
import Getcommunitypost from './Getcoomunitypost';
import CreatePost from '../../components/Post/CreatePost';
import comment from "../../img/comment.png"
import chat from "../../img/chat.png"
import PostComment from '../PostComment';
import GetComment from '../GetComment';

const Dashboard = ({ chatdatahandler, userId, userdata }) => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);

  const [showcomment, setShowcomment] = useState(false);
  const [postData, setPostData] = useState([]);  //empty array
  const [showCreatePost, setshowCreatePost] = useState(false);  //empty array


  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const communityDoc = await getDoc(doc(db, 'community', communityId));
        if (communityDoc.exists()) {
          setCommunity(communityDoc.data());
        } else {
          console.log('Community not found');
        }
      } catch (error) {
        console.error('Error fetching community:', error);
      }
    };

    fetchCommunity();

    const fetchpost = async () => {
      try {
        const fetchedpostdata = await Getcommunitypost(communityId)
        setPostData(fetchedpostdata);

      }
      catch (err) {
        console.log(err);
      }
    }
    fetchpost();


  }, [communityId]);

  const tooglecommentbox = () => {
    setShowcomment(!showcomment);
  }
  if (!community) {
    return <div>Loading...</div>;
  }

  const createposthandler = () => {
    setshowCreatePost(!showCreatePost);
  }

  const chatHandler = async (PuserId, Pusername) => {
    try {

      const friendArray = userdata.friends || [];

      // Check if the room name already exists in the user's friends array
      const existingFriend = friendArray.find(friend => friend.roomname.includes(Pusername));
      if (existingFriend) {
        // If the room name exists, fetch room name and friend name
        const { roomname, friendname } = existingFriend;
        const data = {
          roomname: roomname,
          friendname: friendname,
          friendId: PuserId,
        }
        chatdatahandler(data)

      } else {

        const roomname = `${Pusername}-${userdata.username}`;

        // Add the new friend data to the friendArray
        const newFriendData = {
          friendname: Pusername,
          friendId: PuserId,
          roomname: roomname
        };
        const userRef = doc(db, 'users', userId)

        await updateDoc(userRef, {
          friends: [...friendArray, newFriendData]
        });

        chatdatahandler(newFriendData)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="lrhandler height">
      <Navigation userId={userId} userdata={userdata} />
      <div >
        <h1>Community : {community.name}</h1>
        <nav>
          <button onClick={() => createposthandler()}>Create Post</button>
        </nav>

        {showCreatePost ? (
          <CreatePost userId={userId} userdata={userdata} communityId={communityId} communityname={community.name} />
        ) : (
          <div className="d-flex flex-column">
            {postData.map((post) => {
              return (
                <div key={post.id} className="card mb-3" style={{ maxWidth: '50rem' }}>
                  <img src={post.postimg} style={{ width: '25rem', height: '20rem' }} className="card-img-top" alt="Post" />
                  <div className="card-body">
                    <h3 className="card-title" style={{ margin: '10px' }}>{post.title}</h3>
                    <p className="card-text">{post.postdesc}</p>
                    <div className="d-flex justify-content-between align-items-center " style={{ margin: '10px' }}>
                      <img className="icon  cursor-pointer-hover " onClick={tooglecommentbox} src={comment} alt="comment" />


                      <span style={{ margin: '10px' }} className=' cursor-pointer-hover' onClick={() => chatHandler(post.userId, post.username)}>

                        <Link to="/Chat">
                          <img src={chat} alt="" className='icon' />
                          {(post.username == userdata.username) ? 'Its Your Post' : `Chat with ${post.username} `}
                        </Link>
                      </span>

                    </div>
                    <div style={{ margin: '10px' }}>
                      {showcomment && <GetComment postId={post.id}  />}
                    </div>
                    <div style={{ margin: '10px' }}>
                      {showcomment && <PostComment   userId={userId} username={userdata.username}   postId={post.id} communityId={post.communityId}/>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;