import React, { useEffect, useState } from 'react';
import style from "../style/signup.module.css";
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import like from "../../img/like.png";
import dislike from "../../img/dislike.png";
import comment from "../../img/comment.png";
import GetComment from '../GetComment';
import FetchPostsByUserId from './FetchPostByUserId';

const Post = ({ userId, userdata }) => {
  const [postData, setPostData] = useState([]);  // State to store post data
  const [showcomment, setShowcomment] = useState(false);  // State to toggle comment visibility

  // Function to fetch posts by user ID
  const fetchPosts = async () => {
    try {
      const fetchedPosts = await FetchPostsByUserId(userId);
      setPostData(fetchedPosts);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    // Fetch posts when component mounts or when userId changes
    fetchPosts();
  }, [userId]);

  // Toggle comment visibility
  const toggleCommentBox = () => {
    setShowcomment(!showcomment);
  }

  const deleteHandler = async (postId) => {
    try {
      //get referance
      const postRef = doc(db, 'post', postId);
      await deleteDoc(postRef);
      alert("Post deleted successfully.");

      const commentsSnapshot = await getDocs(query(collection(db, 'comments'), where('postId', '==', postId)));
      const deleteCommentsPromises = commentsSnapshot.docs.map((commentDoc) => deleteDoc(commentDoc.ref));
      await Promise.all(deleteCommentsPromises);

      fetchPosts();

      alert("Post and associated data deleted successfully.");
    } catch (err) {
      console.error("Error deleting post:", err);
      alert("An error occurred while deleting the post.");
    }
  };


  return (
    <div>
      <h1 className="text-center mt-3">All posts</h1>
      <div className='border-bottom'>
        {postData.map((post) => (
          <div key={post.id} className=" card h-25 mt-3">
            <div className="card-body">
              <h2 className="card-title">{post.title}</h2>
              <img style={{height:"300px",width :"500px"}} className="card-img-top" src={post.postimg} alt="not available" />
              <p className="card-text">{post.postdesc}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className='cursor-pointer-hover' onClick={toggleCommentBox}>show comments
                  <img className='icon mx-2'     style={{ height: "30px" }}   src={comment} alt="comment" />
                </div>
                <button className="btn btn-danger" onClick={() => deleteHandler(post.id)}>Delete post </button>
              </div>
              {showcomment && <GetComment postId={post.id} username={userdata.username} userId={userId} />}
            </div>
          </div>
        ))}
      </div>
    </div> 
  );
};

export default Post;
