import React, { useEffect, useState } from 'react';
import Navigation from '../../components/Navigation';
import { doc, updateDoc, arrayUnion, collection, addDoc } from 'firebase/firestore'; // Assuming you're using Firestore
import { db } from '../../firebase';

const Doctor = ({ userId, userdata }) => {
    const [clientlist, setClientlist] = useState([]);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [render, setRender] = useState(false);
    useEffect(() => {
        if (userdata && userdata.clients) {
            setClientlist(userdata.clients);
        }
        console.log(clientlist)
    }, [userId, render]);

    const handleAppointment = async (clientId, clientName, date, time) => {
        const updatedClients = clientlist.map(client => {
            if (client.id === clientId) {
                return { ...client, appointment: { date, time } };
            }
            return client;
        });

        setClientlist(updatedClients);
        console.log(updatedClients)

        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                clients: updatedClients,
                useralert:true
            });
            const msg = `you have an appointmwnt on ${date} ${time} with ${userdata.username}`;
            const notificationcollection = collection(db, 'notify');
            addDoc(notificationcollection, {
                data: msg,
                msgto: clientName,
                msgfrom: userdata.username
            })
            alert(`${clientName} will be nofity`)
        } catch (error) {
            console.error('Error updating document: ', error);
        }
        setRender(!render)
    };

    return (
        <div className="lrhandler height">
            <Navigation userId={userId} userdata={userdata} />
            <div className='doctor-body'>
                <div className="doctor-panel">
                    <h2>Doctor Panel</h2>
                    <div className="doctor-list">
                        <h3>List of Clients</h3>
                        <ol>
                            {clientlist.map((client, index) => (
                                <li key={index}> {client.name}</li>
                            ))}
                        </ol>
                    </div>
                    <div className="doctor-appointments">
                        <h3>Appointments</h3>
                        {clientlist.map((client, index) => (
                            <div key={index}>
                                {!client.appointment && (
                                    <div>
                                        <input value={date} onChange={(e) => setDate(e.target.value)} type="text" placeholder='enter date' />
                                        <input value={time} onChange={(e) => setTime(e.target.value)} type="text" placeholder='enter time' />
                                        <button onClick={() => handleAppointment(client.id, client.name, date, time)}>
                                            Add appointment for {client.name}
                                        </button>
                                    </div>
                                )}

                            </div>
                        ))}
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Patient</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientlist.map((client, index) => (
                                    client.appointment && (
                                        <tr key={index}>
                                            <td>{client.appointment.date}</td>
                                            <td>{client.appointment.time}</td>
                                            <td>{client.name}</td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Doctor;
