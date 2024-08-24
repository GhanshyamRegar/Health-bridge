import React, { useEffect, useState } from 'react'
import FetchPostsByUserId from './FetchPostByUserId'
import style from "../style/signup.module.css";
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import comment from "../../img/comment.png"
import GetComment from '../GetComment';
import Post from './Post';
import Community from './Community';

const All = ({ userdata, userId }) => {

  return (
    <div>
      <h1>All your posts and communities</h1>
        <div>
          <Post className="" userId={userId} userdata={userdata} />
        </div>
        <div>
          <Community userId={userId} userdata={userdata} />
        </div>

      </div >

    // </div>
  )
}

export default All
