import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import img from "../img/logo.png";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";

const Navbar = ({ searchUserSet, userId, userdata, userDatarole, admin, username }) => {

  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    if (userdata && userdata.useralertmsg && userdata.useralertmsg === true) {
      alert("you got a new msg")
      const updateyourdoc = async () => {
        const userref = doc(db, 'users', userId);
        await updateDoc(userref, {
          useralertmsg: false
        });


      }
      updateyourdoc()
    }
    if (userdata && userdata.useralert && userdata.useralert == true) {
      alert("you got a new notification")
      const updateyoursdoc = async () => {
        const userref = doc(db, 'users', userId);
        await updateDoc(userref, {
          useralert: false
        });
      }

      updateyoursdoc()
    }
  })

  const handleSearch = async () => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(query(usersRef, where("username", "==", searchName)));
      
      const commRef = collection(db, "community");
      const commquerySnapshot = await getDocs(query(commRef, where("name", "==", searchName)));

      const posttRef = collection(db, "post");
      const postquerySnapshot = await getDocs(query(posttRef, where("title", "==", searchName)));


      const foundUsers = [];
      querySnapshot.forEach((doc) => {
        foundUsers.push({ id: doc.id, ...doc.data() });
      });
      commquerySnapshot.forEach((doc) => {
        foundUsers.push({ id: doc.id, ...doc.data() });
      });
      postquerySnapshot.forEach((doc) => {
        foundUsers.push({ id: doc.id, ...doc.data() });
      });

      searchUserSet(foundUsers);
      setSearchName("")
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-div">
          <img className="navbar-logo" src={img} alt="Logo" />
          <input
            type="search"
            name="search"
            id="search"
            className="navbar-search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search"
          />
          <Link to="/Explore">
            <button className="searchbutton" onClick={handleSearch}>Search</button>
          </Link>

          <ul className="navbar-ul">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
            <li>
              <Link to="/Explore">Explore</Link>
            </li>
            <li>
              <Link to="/Chat">Chat</Link>
            </li>
            <li>
              <Link to="/Profile">{(userDatarole == "doctor") ? "Dr." : null} {username} Profile</Link>
            </li>
            {admin && (
              <li>
                <Link to="/AdminPanel">Admin Panel</Link>
              </li>
            )}
            {userDatarole == "doctor" ? (
              <li>
                <Link to="/DoctorPanel">Doctor Panel</Link>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
