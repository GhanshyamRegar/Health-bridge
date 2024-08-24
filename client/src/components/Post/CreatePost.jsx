import React, { useEffect, useState } from 'react';
import Navigation from '../Navigation';
import "./style.css"
import Setpost from './Setpost';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, imgdb } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';


const CreatePost = ({ userId,userdata , communityId, communityname }) => {

  const [logo, setlogo] = useState("");

  const [formData, setFormData] = useState({
    title: '',
    postimg: '',
    postdesc: '',
    communityId: communityId,
    communityname: communityname,
    userId: userId,
    username:userdata.username,
    role:userdata.role

  });

  useEffect(() => {

    const upload = async () => {

      const imgref = ref(imgdb, `files/${v4()}`)
      await uploadBytes(imgref, logo).then(async (value) => {

        await getDownloadURL(value.ref).then(imgurl => {
          setFormData({
            ...formData,postimg:imgurl
          })

        })

      })

    }
    upload();

}, [logo])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a post with the same title already exists in the community
    const existingPostQuery = query(collection(db, 'posts'), where('title', '==', formData.title), where('communityId', '==', communityId));
    const existingPostSnapshot = await getDocs(existingPostQuery);
    if (!existingPostSnapshot.empty) {
      alert('A post with this title already exists in the community.');
      return;
    }

    // Create the post if it doesn't already exist
    try {
      await Setpost(formData);
      alert('Post created successfully.');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('An error occurred while creating the post.');
    }
  };

  return (
    <div className='lrhandler'>
      <div>
        <form onSubmit={handleSubmit}>
          <div className='posthead'>
            <h1 className='posthead'>Title</h1>
            <input className='postheadinput' name='title' value={formData.title} onChange={handleChange} type="text" placeholder='Enter title' required />
          </div>

          <div className='posthead'>
            <h2 className='posthead'>select file </h2>
            <input className='postheadinput' name='postimg'onChange={e=>{setlogo(e.target.files[0])}} type="file" placeholder='Add Img' />
          </div>

          <div className='posthead'>
            <h2 className='posthead'>Add description</h2>
            <textarea className='postdesc' name='postdesc' value={formData.postdesc} onChange={handleChange} placeholder='Add description' required />
          </div>

          <button className='postbtn' type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
