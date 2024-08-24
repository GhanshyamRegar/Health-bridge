import React from 'react'

import { Link } from "react-router-dom";
import Navigation from '../Navigation'
import {Routes,Route} from 'react-router-dom'
import "./style.css"
import All from '../../pages/activity/All'
import Post from '../../pages/activity/Post'
import Community from '../../pages/activity/Community'

const Myactivity = ({userId,userdata}) => {
    return (
        <div className='lrhandler height'>
            <Navigation  userId={userId} userdata={userdata}/>
            <div className='act_div'>

                <h3 className='act_head'>Activities</h3>
                <ul className='act_ul'>
                    <li><Link to="">All</Link></li>
                    <li><Link to="YourPost">Your Post</Link></li>
                    <li><Link to="joinedCommunity">Your Community</Link></li>
                   
                </ul>

                <div className="result">
                <Routes>
                    <Route exact index path="/"  element={<All userdata={userdata} userId={userId} />}/>
                    <Route path="/YourPost"  element={<Post  userdata={userdata} userId={userId}/>}/>
                    <Route path="/joinedCommunity"  element={<Community userdata={userdata} userId={userId}/>}/>
                </Routes>
                </div>
            </div>
        </div>
    )
}

export default Myactivity
