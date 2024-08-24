import React from 'react'
import Navigation from '../../components/Navigation'
// import Signup from '../Signup'
// import Login from '../Login'
import {Routes,Route, Link} from "react-router-dom"
import Editprofile from './Editprofile'
import Editcommunity from './Editcommunity'
const Profile = ({userdata,userId}) => {
  return (
    <div className='lrhandler height'>
      <Navigation  userId={userId} userdata={userdata} />
      <div>

        <Link to="edit-community" >Edit your communities</Link>
        <Link to="" >Edit your Profile</Link>


        <Routes>
          <Route index  element={ <Editprofile  index userId={userId}  userdata={userdata} />}   />
          <Route path='/edit-community' element={ <Editcommunity  index userId={userId}  userdata={userdata} />}   />

        </Routes>

      </div>
    </div>
  )
}

export default Profile
