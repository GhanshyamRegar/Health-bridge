import React, { useEffect, useState } from 'react';
import Navigation from '../Navigation';
import Setcommunity from './Setcommunity';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, imgdb } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';

const CreateCommunity = ({ userId, userdata }) => {

  const [logo, setlogo] = useState("");

  
    const [formData, setFormData] = useState({
      name: '',
      creatorname: userdata.username,
      creatorId: userId,
      communitydesc: '',
      communitilogo: ''
    });

  useEffect(() => {

        const upload = async () => {

          const imgref = ref(imgdb, `files/${v4()}`)
          await uploadBytes(imgref, logo).then(async (value) => {

            await getDownloadURL(value.ref).then(imgurl => {
              setFormData({
                ...formData,communitilogo:imgurl
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

    // Check if the community already exists
    const existingCommunityQuery = query(collection(db, 'community'), where('name', '==', formData.name));
    const existingCommunitySnapshot = await getDocs(existingCommunityQuery);
    if (!existingCommunitySnapshot.empty) {
      alert('A community with this name already exists.');
      return;
    }

    // Create the community if it doesn't already exist
    try {
      await Setcommunity(formData, userId);
      alert('Community created successfully.');
    } catch (error) {
      console.error('Error creating community:', error);
      alert('An error occurred while creating the community.');
    }
  };

  return (
    <div className='lrhandler'>
      <Navigation userId={userId} userdata={userdata} />
      <div>
        <h1>Create Community</h1>
        <form onSubmit={handleSubmit}>
          <div className='posthead'>
            <h1 className='posthead'>Title</h1>
            <input className='postheadinput' name='name' value={formData.name} onChange={handleChange} type="text" placeholder='Enter title' required />
          </div>

          <div className='posthead'>
            <h2 className='posthead'>select image(Optional)</h2>
            <input className='postheadinput' name='communitilogo' onChange={(e)=>{setlogo(e.target.files[0])}} type="file" />
          </div>

          <div className='posthead'>
            <h2 className='posthead'>Add description</h2>
            <textarea className='postdesc' name='communitydesc' value={formData.communitydesc} onChange={handleChange} placeholder='Add description' required />
          </div>
          <button className='postbtn' type="submit">Post</button>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;
