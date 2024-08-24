import React, { useEffect, useState } from 'react'
import comment from "../../img/comment.png"
import chat from "../../img/chat.png"
import Navigation from '../../components/Navigation'
import Getposts from './Getposts';
import PostComment from '../PostComment';
import GetComment from '../GetComment';
import { Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const Explore = ({ searchuserdata, chatdatahandler, userId, userdata }) => {
  const [showCreatePost, setshowCreatePost] = useState(false);  //empty array
  const [showcomment, setShowcomment] = useState(false);
  const [commentsubmit, setcommentsubmit] = useState(false);
  const [postData, setPostData] = useState([]);  //empty array

  useEffect(() => {


    const fetchpost = async () => {
      try {
        const fetchedpostdata = await Getposts()
        setPostData(fetchedpostdata);

      }
      catch (err) {
        console.log(err);
      }
    }
    fetchpost();


  }, [])
  const toggleCommentBox = () => {
    setShowcomment(!showcomment);
  }
  const chekcommentsubmit = () => {
    setShowcomment(!showcomment);
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

        {showCreatePost ? (
          <CreatePost userId={userId} userdata={userdata} communityId={communityId} communityname={post.communityname} />
        ) : (
          <div className="d-flex flex-column">

            {searchuserdata && searchuserdata[0] && searchuserdata.map((user) => (
              <div key={user.id}>

                {user.profilepic &&
                  <div className="docprofile-profile">
                    <img src={`${user.profilepic}`} alt="Doctor Profile Picture" />
                    <div className="docprofile-profile-info">
                      <h2>Username: {user.username}</h2>
                      <p>Name:{user.name}</p>
                      <p>Email: {user.email}</p>
                      <p>Role: {user.role}</p>
                      <p>Description: {user.desc}</p>

                      <span style={{ margin: '10px' }} className=' cursor-pointer-hover' onClick={() => chatHandler(user.id, user.username)}>

                        <Link to="/Chat">
                          <img src={chat} style={{ height: '30px', width: '30px', margin: 0 }} className='icon' />
                          {`Chat with ${user.username} `}
                        </Link>
                      </span>

                    </div>
                  </div>
                }
                {
                  user.title &&
                  <div key={user.id} style={{ maxWidth: '50rem' }}>

                    <h1>Community : {user.communityname}</h1>
                    <img src={user.postimg} style={{ width: '25rem', height: '20rem' }} alt="Post" />
                    <div className="card-body">
                      <h3 className="card-title" style={{ margin: '10px 0' }}>{user.title}</h3>
                      <p className="card-text h4" >{user.postdesc}</p>
                      <div className="d-flex justify-content-between align-items-center " style={{ margin: '10px' }}>
                        <img className="icon  cursor-pointer-hover " onClick={toggleCommentBox} src={comment} alt="comment" />


                        <span style={{ margin: '10px', width: '20px' }} className=' cursor-pointer-hover' onClick={() => chatHandler(user.userId, user.username)}>

                          <Link to="/Chat">
                            <img src={chat} className='icon' />
                            {(user.username == userdata.username) ? 'Its Your Post' : `Chat with ${user.username} `}
                          </Link>
                        </span>

                        {user.role == "doctor" ?
                          (<div>
                            <Link to={`/DoctorProfile/${user.userId}`}>
                              Goto Doctor {user.username} 's profile
                            </Link>
                          </div>) : null

                        }

                      </div>
                      <div style={{ margin: '10px' }}>
                        {showcomment && <GetComment postId={user.id} />}
                      </div>
                      <div style={{ margin: '10px' }}>
                        {showcomment && <PostComment userId={userId} username={userdata.username} postId={user.id} communityId={user.communityId} />}
                      </div>
                    </div>
                  </div>
                }

                {user.creatorId &&
                  <div className="docprofile-profile">
                  <img src={`${user.communitilogo}`} alt="Doctor Profile Picture" />
                  <div className="docprofile-profile-info">
                    <h2>Community name: {user.name}</h2>
                    <p>Description: {user.communitydesc}</p>
                  <p>Creator Id : {user.creatorname}</p>


                  </div>
                </div>


                }
              </div>
            ))}

            {postData.map((post) => {
              return (
                <div key={post.id} style={{ maxWidth: '50rem' }}>

                  <h1>Community : {post.communityname}</h1>
                  <img src={post.postimg} style={{ width: '25rem', height: '20rem' }} alt="Post" />
                  <div className="card-body">
                    <h3 className="card-title" style={{ margin: '10px 0' }}>{post.title}</h3>
                    <p className="card-text h4" >{post.postdesc}</p>
                    <div className="d-flex justify-content-between align-items-center " style={{ margin: '10px' }}>
                      <img className="icon  cursor-pointer-hover " onClick={toggleCommentBox} src={comment} alt="comment" />


                      <span style={{ margin: '10px', width: '20px' }} className=' cursor-pointer-hover' onClick={() => chatHandler(post.userId, post.username)}>

                        <Link to="/Chat">
                          <img src={chat} className='icon' />
                          {(post.username == userdata.username) ? 'Its Your Post' : `Chat with ${post.username} `}
                        </Link>
                      </span>

                      {post.role == "doctor" ?
                        (<div>
                          <Link to={`/DoctorProfile/${post.userId}`}>
                            Goto Doctor {post.username} 's profile
                          </Link>
                        </div>) : null

                      }

                    </div>
                    <div style={{ margin: '10px' }}>
                      {showcomment && <GetComment chekcommentsubmit={chekcommentsubmit} postId={post.id} />}
                    </div>
                    <div style={{ margin: '10px' }}>
                      {showcomment && <PostComment chekcommentsubmit={chekcommentsubmit} userId={userId} username={userdata.username} postId={post.id} communityId={post.communityId} />}
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

export default Explore;