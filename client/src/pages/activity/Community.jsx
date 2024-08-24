import React, { useEffect, useState } from 'react';
import { doc, deleteDoc, updateDoc, arrayRemove, getDocs, query, collection, where } from 'firebase/firestore';
import { db } from '../../firebase';
import Getcomdetail from '../profile/Getcomdetail';

const Community = ({ userId }) => {
  const [formDataList, setFormDataList] = useState([]);

  const fetchCommunity = async () => {
    try {
      const fetchdata = await Getcomdetail(userId);
      if (fetchdata) {
        setFormDataList(fetchdata);
      } else {
        alert("User has no community");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [userId]);

  const deleteHandler = async (commId) => {

    try {
      const postsSnapshot = await getDocs(query(collection(db, 'post'), where('communityId', '==', commId)));
      const deletePostsPromises = postsSnapshot.docs.map((postDoc) => deleteDoc(doc(db, 'post', postDoc.id)));

      const commentsSnapshot = await getDocs(query(collection(db, 'comments'), where('communityId', '==', commId)));
      const deleteCommentsPromises = commentsSnapshot.docs.map((commentDoc) => deleteDoc(doc(db, 'comments', commentDoc.id)));

      await Promise.all([...deletePostsPromises, ...deleteCommentsPromises]);

      const commRef = doc(db, 'community', commId);
      await deleteDoc(commRef);

      const updatedFormDataList = [...formDataList];
      const index = updatedFormDataList.findIndex(data => data.id === commId);
      updatedFormDataList.splice(index, 1);
      setFormDataList(updatedFormDataList);

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        communities: arrayRemove(commId)
      });

      alert("Community and associated data deleted successfully.");
    } catch (err) {
      console.error("Error deleting community:", err);
      alert("An error occurred while deleting the community.");
    }
  };

  return (
    <div className="container">
      <h1>All communities</h1>
      <div className="row">
        {formDataList.map((data) => (
          <div key={data.id} className="col-md-6 mx-auto ">
            <div   className=" card mb-3">
              <img style={{ maxHeight: "400px" }}   src={data.data.communitilogo} className="card-img-top" alt="Community logo" />
              <div className="card-body">
                <h2 className="card-title">{data.data.name}</h2>
                <p className="card-text">{data.data.communitydesc}</p>
                <button onClick={() => deleteHandler(data.id)} className="btn btn-danger">Delete Community</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
