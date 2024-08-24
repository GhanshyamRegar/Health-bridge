import About from "../pages/About";
import Home from "../pages/Home";
import Explore from "../pages/explore/Explore";
import { Routes, Route } from "react-router-dom"
import Chat from "../pages/Chat";
import Profile from "../pages/profile/Profile";
import CreateCommunity from "./community/CreateCommunity";
import Myactivity from "./myactivity/Myactivity";
import Help from "../pages/Help";
import Joincommunity from "../pages/joincommunity/Joincommunity";
import Dashboard from "../pages/joincommunity/Dashboard";
import { useEffect, useState } from "react";
import Admin from "../pages/admin/Admin";
import Doctor from "../pages/doctor/Doctor";
import Doctorprofile from "../pages/doctor/Doctorprofile";
import Notification from "./notification/Notification";
const Midright = ({ searchuserdata,changeUser, userdata, userId }) => {
  const [chatdata, setchatdata] = useState([]);

  useEffect(() => {
    chatdatahandler(chatdata)
  }, [chatdata])

  const chatdatahandler = (data) => {
    setchatdata(data);
  }
  return (
    <div>
      <Routes>
        <Route index path="/" element={<Home userId={userId} userdata={userdata} />} />
        <Route path="/about" element={<About userId={userId} userdata={userdata} />} />
        <Route path="/notify" element={<Notification userId={userId} userdata={userdata} />} />
        <Route path="/Explore" element={<Explore searchuserdata={searchuserdata} chatdatahandler={chatdatahandler} userId={userId} userdata={userdata} />} />
        <Route path="/Chat" element={<Chat chatdata={chatdata} userId={userId} userdata={userdata} />} />
        <Route path="/Profile/*" element={<Profile userId={userId} userdata={userdata} />} />
        <Route path="/Createcommunity" element={<CreateCommunity userId={userId} userdata={userdata} />} />
        <Route path="/JoinCommunity" element={<Joincommunity userId={userId} userdata={userdata} />} />

        <Route path="/dashboard/:communityId" element={<Dashboard chatdatahandler={chatdatahandler} userId={userId} userdata={userdata} />} />

        <Route path="/Activity/*" element={<Myactivity userId={userId} userdata={userdata} />} />
        <Route path="/help" element={<Help userId={userId} userdata={userdata} />} />
        
        <Route path="/AdminPanel" element={<Admin changeUser={changeUser} userId={userId} userdata={userdata} />} />
        <Route path="/DoctorPanel" element={<Doctor userId={userId} userdata={userdata} />} />
        <Route path="/DoctorProfile/:doctorId" element={<Doctorprofile chatdatahandler={chatdatahandler} userId={userId} userdata={userdata} />} />

      </Routes>
    </div>
  )
}

export default Midright
