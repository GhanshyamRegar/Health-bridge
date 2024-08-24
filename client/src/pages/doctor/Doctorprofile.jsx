import React, { useEffect, useState } from 'react'
import Navigation from '../../components/Navigation'
import { Link, useParams } from 'react-router-dom'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import chat from "../../img/chat.png"

const Doctorprofile = ({ chatdatahandler,userId, userdata }) => {
    const { doctorId } = useParams()
    const [doctordata, setDoctorData] = useState({})
    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const doctorRef = doc(db, 'users', doctorId);
                const doctorSnapshot = await getDoc(doctorRef);

                if (doctorSnapshot.exists()) {
                    const data = doctorSnapshot.data();
                    setDoctorData(data);
                } else {
                    console.log('Doctor not found');
                }
            } catch (error) {
                console.error('Error fetching doctor data:', error);
            }
        };

        fetchDoctorData();
    }, [doctorId]);

    const addClient = async (clientId, clientname) => {
        try {

            if (clientId != doctorId) {
                const doctorRef = doc(db, 'users', doctorId);
                if (userdata.role!="doctor") 
                {

                    await updateDoc(doctorRef, {
                        clients: arrayUnion({
                            id: clientId,
                            name: clientname,
                        })
                    })
                    alert("request send")
                }
                else{
                    alert("you are a doctor can't take any appointment from others")
                }
            }
            else {
                alert("you can't take your own appointment")
            }
        }
        catch (err) {
            console.log("error updating",err)
        }
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
            alert("runned")
    
          } else {
    
            const roomname = `${Pusername}-${userdata.username}`;
            
            // Add the new friend data to the friendArray
            const newFriendData = {
                friendname: Pusername,
                friendId: PuserId,
                roomname: roomname
            };
            const userRef = doc(db, 'users', userId)
            
            console.log(PuserId)
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


        <div className="docprofile lrhandler">
            <Navigation userId={userId} userdata={userdata} />
            <div className="docprofile-container">
                <div className="docprofile-profile">
                    <img src={doctordata.profilepic} alt="Doctor Profile Picture" />
                    <div className="docprofile-profile-info">
                        <h2>{doctordata.name}</h2>
                        <p>Experience: {doctordata.exp}years</p>
                        <p>description: {doctordata.desc}</p>
                    </div>
                </div>
                <div className="docprofile-certification">
                    <h3>Certification</h3>
                    <img src={doctordata.file} alt="Certification" />
                </div>

                <span style={{ margin: '10px' }} className=' cursor-pointer-hover' onClick={() => chatHandler(doctorId, doctordata.username)}>

                    <Link to="/Chat">
                        <img src={chat} alt="" className='icon' />
                        {`Chat with ${doctordata.username} `}
                    </Link>
                </span>

                <div onClick={() => { addClient(userId, userdata.username); }} className="docprofile-appointment-button">Get Appointment</div>
            </div>
        </div>
    )
}

export default Doctorprofile
