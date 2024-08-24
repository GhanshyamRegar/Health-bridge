import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { db } from '../firebase';


const PostComment = ({ chekcommentsubmit,userId, username, postId,communityId }) => {
  const [comment, setComment] = useState("")
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add the comment to Firestore
      const docRef = await addDoc(collection(db, 'comments'), {
        postId: postId,
        userId: userId,
        username: username,
        comment: comment,
        timestamp:new Date(),
        communityId:communityId
      });
      console.log('Comment added with ID: ', docRef.id);
      // Clear the comment input after submitting
      chekcommentsubmit()
      setComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  }


  return (
    <div>

      {username}
      <div >
        <form onSubmit={handleSubmit} >
          <textarea

            value={comment}
            onChange={handleChange}
            placeholder="Write your comment..."
          />
          <button type="submit" >
            Add Comment
          </button>
        </form>
      </div>
    </div>

  )
}

export default PostComment
