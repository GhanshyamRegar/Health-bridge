import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'

const GetComment = ( {postId}) => {

    const [comments,setComments] = useState([])

    useEffect(()=>{
        const fetchcomments = async()=>{
            const commentRef = collection(db,'comments');
            const q = query(commentRef,where("postId","==",postId))
            const commentsnapshot = await getDocs(q);

            const commentsarray = [];
            commentsnapshot.forEach(doc => {
                commentsarray.push({
                    id:doc.id,
                    ...doc.data()
                })
            });
            setComments(commentsarray)
        }
        fetchcomments();
    },[])

    return (
        
        <div  style={{ maxHeight: '200px', overflowY: 'auto', textAlign: 'left', border: '1px solid #ccc', padding: '20px' }}>
            Check comments
          <ul style={{listStyle:'none'}}>
            {comments.map(comment => (
              <li key={comment.id  }  style={{margin:'10px'}}>
                <div>sender : {comment.username}</div>
                <div>{comment.comment} </div>
                </li>
            ))}
          </ul>
        </div>
      );
}

export default GetComment
