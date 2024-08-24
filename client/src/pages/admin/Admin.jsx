import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDocs, collection, query, where, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const Admin = ({ userId, userdata, changeUser }) => {
    const [searchName, setSearchName] = useState("");
    const [users, setUsers] = useState([]);
    const [admin, setadmin] = useState({});
    const [showAnalytics, setshowAnalytics] = useState(false);
    const [showpendingdoc, setshowpendingdoc] = useState(false);
    const [count, setCount] = useState({
        users: 0,
        posts: 0,
        community: 0
    });
    const [docfiles, setDocFiles] = useState({}); // Store docfiles for each user

    useEffect(() => {
        if (userdata.username === "Admin") {
            setadmin({ id: userId, data: userdata });
        }
        const fetchCounts = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersCount = usersSnapshot.size;
                setCount(prevCount => ({ ...prevCount, users: usersCount }));

                const postsSnapshot = await getDocs(collection(db, "post"));
                const postsCount = postsSnapshot.size;
                setCount(prevCount => ({ ...prevCount, posts: postsCount }));

                const communitiesSnapshot = await getDocs(collection(db, "community"));
                const communitiesCount = communitiesSnapshot.size;
                setCount(prevCount => ({ ...prevCount, community: communitiesCount }));
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, []);

    const handleSearch = async () => {
        try {
            const usersRef = collection(db, "users");
            const querySnapshot = await getDocs(query(usersRef, where("username", "==", searchName)));

            const foundUsers = [];
            querySnapshot.forEach((doc) => {
                foundUsers.push({ id: doc.id, ...doc.data() });
            });

            setUsers(foundUsers);
        } catch (error) {
            console.error("Error searching users:", error);
        }
    };

    const deleteUser = async (username) => {
        setSearchName(username);
        alert("You have to login again using email and password of the user than delete it ");
        await handleSearch();
    };

    const checkUserHandler = async (name, userId) => {
        try {
            const userColl = collection(db, 'users');
            const userRef = await getDocs(query(userColl, where("username", "==", name)));

            if (!userRef.empty) {
                const userData = userRef.docs[0].data();
                const doctorData = {
                    id: userRef.docs[0].id,
                    file: userData.file
                };
                setDocFiles(prevDocFiles => ({ ...prevDocFiles, [userId]: doctorData }));
            } else {
                console.log("User not found");
            }
        } catch (error) {
            console.error("Error checking user:", error);
        }
    };

    const verifyDoctor = async (doctorId, doctorname) => {
        const userref = doc(db, 'users', doctorId);
        await updateDoc(userref, { verify: true });

        const userColl = collection(db, 'users');
        const adminRef = await getDocs(query(userColl, where("username", "==", "Admin")));

        await updateDoc(adminRef.docs[0].ref, {
            pendingDoctors: arrayRemove({ username: doctorname, userId: doctorId })
        });
        alert("Doctor is verified");
    };

    return (
        <div className="admin-body">
            <input
                className="admin-input"
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search user by name"
            />
            <button className="admin-button" onClick={handleSearch}>Search</button>

            <ul>
                {users.map((user) => (
                    <div key={user.id}>
                        <li>Name: {user.name}</li>
                        <li>Username: {user.username}</li>
                        <li>Email: {user.email}</li>
                        <li>Password: {user.password}</li>
                        <li>Role: {user.role}</li>
                        <li><img src={user.profilepic} alt="img not available" /></li>
                        <button onClick={() => deleteUser(user.username)}>Delete user</button>
                        <button onClick={() => { changeUser(user.id, user); alert(`Now you are ${user.username}`) }}>View and edit user activity</button>
                    </div>
                ))}
                {userdata.username !== "Admin" && (
                    <button onClick={() => { changeUser(admin.id, admin.data); alert(`Now you are Admin`) }}>
                        Return to Admin
                    </button>
                )}
            </ul>

            <div>
                <button className="admin-button" onClick={() => { setshowAnalytics(!showAnalytics) }}>Show Analytics</button>
                {showAnalytics && (
                    <div className="admin-body">
                        <div className="admin-container">
                            <div className="admin-box users">
                                <div className="admin-title">Users</div>
                                <div className="admin-value">{count.users}</div>
                            </div>
                            <div className="admin-box communities">
                                <div className="admin-title">Communities</div>
                                <div className="admin-value">{count.posts}</div>
                            </div>
                            <div className="admin-box posts">
                                <div className="admin-title">Posts</div>
                                <div className="admin-value">{count.community}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div>
                <button className="admin-button" onClick={() => { setshowpendingdoc(!showpendingdoc) }}>Show Pending doctors</button>
                {showpendingdoc && (
                    <div>
                        <ul>
                            {userdata.pendingDoctors && userdata.role === "Admin" && userdata.pendingDoctors.length > 0 ? (
                                userdata.pendingDoctors.map((doctor, index) => (
                                    <li className="lrhandler mtop-20" key={index}>
                                        <h2>{doctor.username}</h2>
                                        <div>
                                         <button className="admin-button" onClick={(e) => checkUserHandler(doctor.username, doctor.userId)}>Show more details</button>
                                        </div>
                                        {docfiles[doctor.userId] && (
                                            <div>
                                                <img src={docfiles[doctor.userId].file} />
                                                <button className="admin-button" onClick={() => { verifyDoctor(doctor.userId, doctor.username) }}>Verify doctor</button>
                                                <button className="admin-button" onClick={(e) => { deleteUser(doctor.username) }}>Delete fake Doctor</button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            ) : (<div>No pending doctors</div>)
                            }
                         
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
