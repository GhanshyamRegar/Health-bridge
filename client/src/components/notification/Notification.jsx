import React, { useEffect, useState } from 'react';
import Navigation from '../Navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; // Assuming you have a Firebase configuration set up

const Notification = ({ userId, userdata }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Function to fetch notifications from Firebase
        const fetchNotifications = async () => {
            try {
                const q = query(collection(db, 'notify'), where('msgto', '==', userdata.username));
                const snapshot = await getDocs(q);
                const notificationData = snapshot.docs.map(doc => doc.data());
                setNotifications(notificationData);
               
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications(); 
    }, [userId]);

    return (
        <div className=" lrhandler">
            <Navigation />
            <div className='notify-app'>
                <h1>Notifications</h1>
                <div className="notify-notifications">
                    {notifications.map((notification, index) => (
                        <div key={index}>
                            <div><strong>Message: </strong> {notification.data}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notification;
