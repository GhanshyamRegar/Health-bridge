import React, { useEffect, useMemo, useState } from 'react';
import { io } from "socket.io-client";
import "./style/chatform.css"
import style from "../components/style/navbar.module.css";
import { db } from '../firebase';
import { addDoc, arrayUnion, arrayRemove, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where, deleteDoc } from 'firebase/firestore';

const Chat = ({ chatdata, userId, userdata }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(chatdata.roomname);
  const [socketid, setSocketId] = useState("");
  const [receivername, setReceivername] = useState(chatdata.friendname);
  const [receiverId, setReceiverId] = useState(chatdata.friendId);
  const [friends, setFriends] = useState([]);

  const socket = useMemo(() => io("http://localhost:3000"), []);

  const fetchMessages = async () => {
    try {
      if (room) {
        const q = query(
          collection(db, 'messages'),
          where('roomname', '==', room),
          orderBy('timestamp', 'asc') // Order messages by timestamp in ascending order
        );
        const querySnapshot = await getDocs(q);
        const fetchedMessages = [];
        
        querySnapshot.forEach((doc) => {
          fetchedMessages.push(doc.data());
        });
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        if(chatdata.exists)
        {
          try {
            await updateDoc(userRef, {
              friends: arrayUnion({
                friendId: chatdata.friendId,
                friendname: chatdata.friendname,
                roomname: chatdata.roomname
              })
            })
          } catch (err) {
            console.log(err)
          }
        }

        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();

          userData.friends.forEach(async (friend) => {
            const friendRef = doc(db, 'users', friend.friendId);
            const friendDoc = await getDoc(friendRef);
            if (!friendDoc.exists()) {
              // If the friend document doesn't exist, remove the friend from the user's friends array
              await updateDoc(userRef, {
                friends: arrayRemove(friend)
              });
            }
          });
          setFriends(userData.friends)
        }

      } catch (error) {
        console.error("Error fetching user's friends:", error);
      }
    };
    fetchFriends()


    fetchMessages();

    // Socket event listeners
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      console.log("user disconnected ", socket.id);
      socket.disconnect();
    };
  }, [room, userId, receiverId, socket,messages]);

  const handlerSubmit = async (e) => {
    e.preventDefault();

    const messageData = {
      senderName: userdata.username,
      senderId: userId,
      receiverName: receivername,
      receiverId: receiverId,
      roomname: room,
      message: message,
      timestamp: new Date(),
    };

    await addDoc(collection(db, 'messages'), messageData);

    socket.emit("message", { message, room });
    
    // setMessages(prevMessages => [...prevMessages, messageData]);

    const userref = doc(db, 'users', receiverId);
    const newFriendData = {
      friendname: userdata.username,
      friendId: userId,
      roomname: room
    };
    await updateDoc(userref, {
      friends: arrayUnion(newFriendData),
      useralertmsg:true
    });

    setMessage("");
    await fetchMessages()
  };

  const joinroomhandler = (friendId, friendName, roomName) => {
    setReceiverId(friendId);
    setReceivername(friendName);
    setRoom(roomName);
    socket.emit("join-room", roomName);
  };

  const deleteFriend = async (friendId, friendname, roomname) => {
    // Remove friend from user's friends array

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayRemove({ friendId, friendname, roomname, })
    });

    const deleteMessages = async () => {
      const q = query(collection(db, 'messages'), where('roomname', '==', roomname));
      const querySnapshot = await getDocs(q);
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletePromises);
    };
    await deleteMessages();

    alert("deleted")
    // Remove friend from local state
    setFriends((prevFriends) => prevFriends.filter(friend => friend.friendId !== friendId));
  };

  return (
    <div className='lrhandler height'>
      <div>
        <form className={`${style.left}`}>
          <div>
            <h4>Friends:</h4>
            <ul className={`${style.container}`}>
              {friends.map((friend, index) => (
                <li key={index}>
                  <div onClick={() => joinroomhandler(friend.friendId, friend.friendname, friend.roomname)}>
                    {friend.friendname}
                    <button onClick={(e) => { e.preventDefault(); deleteFriend(friend.friendId, friend.friendname, friend.roomname) }}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </div>
      <div className='container '>
        <h3 className='head3'> {receivername}</h3>

        <form onSubmit={handlerSubmit}>
          <div>
            {messages.map((m, index) => {
              return (
                <div key={index} className={m.senderId === userId ? 'message-right' : 'message-left'}>{m.message}</div>
              );
            })}
          </div>
          <input className='inputbox' type="text" value={message} onChange={e => { setMessage(e.target.value) }} />
          <button className='btn' type="submit">submit</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
