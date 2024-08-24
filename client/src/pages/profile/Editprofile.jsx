import React, { useEffect, useState } from 'react';
import "../style/userprofile.css";
import { doc, updateDoc, deleteDoc, getDocs, collection, query, where, arrayRemove } from 'firebase/firestore';
import { db, imgdb } from '../../firebase'; // Assuming db is your Firestore instance
import { getAuth, deleteUser as deleteAuthUser } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
const Editprofile = ({ userdata, userId }) => {
  const [role, setRole] = useState(userdata.role);
  const [name, setName] = useState(userdata.name);
  const [pic, setPic] = useState(userdata.profilepic);
  const [oldpic, setoldPic] = useState(userdata.profilepic);
  const [desc, setDesc] = useState(userdata.desc);

  useEffect(() => {

   console.log(pic)
   if(pic!==oldpic)
   {

     const upload = async () => {
       
          const imgref = ref(imgdb, `files/${v4()}`)
          await uploadBytes(imgref, oldpic).then(async (value) => {
  
            await getDownloadURL(value.ref).then(imgurl => {
              setPic(imgurl)
             
            })
  
          })
          
        }
        upload();
        
    }


  },[oldpic])


  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Reference to the user document in Firestore
      const userDocRef = doc(db, 'users', userId);

      // Update user data
      await updateDoc(userDocRef, {
        name: name,
        role: role,
        profilepic: pic,
        desc: desc,
      });
      alert("Changes saved successfully.");

    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Deleting if doctor
      if (userdata.file) {
        const admindocs = await getDocs(query(collection(db, "users"), where("role", "==", "Admin")));
        const admindata = admindocs.docs[0];
        if (admindata.exists()) {
          await updateDoc(admindata.ref, {
            pendingDoctors: arrayRemove({ userId: userId, username: userdata.username })
          });
          console.log('User removed from admin pendingDoctors successfully.');
        } else {
          console.error('Admin document not found.');
        }
      }
  
      // Delete posts associated with the user
      const postsSnapshot = await getDocs(query(collection(db, 'post'), where('userId', '==', userId)));
      const deletePostsPromises = postsSnapshot.docs.map((postDoc) => deleteDoc(postDoc.ref));
      await Promise.all(deletePostsPromises);
  
      // Delete communities associated with the user
      const communitiesSnapshot = await getDocs(query(collection(db, 'community'), where('userId', '==', userId)));
      const deleteCommunitiesPromises = communitiesSnapshot.docs.map((communityDoc) => deleteDoc(communityDoc.ref));
      await Promise.all(deleteCommunitiesPromises);
  
      // Delete comments associated with the user
      const msgSnapshot = await getDocs(query(collection(db, 'comments'), where('userId', '==', userId)));
      const deletemsgPromises = msgSnapshot.docs.map((communityDoc) => deleteDoc(communityDoc.ref));
      await Promise.all(deletemsgPromises);
  
      // Delete user document from Firestore
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
  
      // Delete user from Firebase Authentication
      const auth = getAuth();
      await deleteAuthUser(auth.currentUser);
  
      alert("User and associated data deleted successfully.");
  
      // Reload the page
      window.location.reload();
  
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("An error occurred while deleting the user.");
    }
  };
  

  return (
    <form onSubmit={handleSignup}>
      <div className='usercont height '>
        <h1>User Profile</h1>
        <img src={pic} alt="" />
        <table className='divtable' >
          <tbody>
            <tr className="div name">
              <td>User Name: </td>
              <td>
                <input type="text" value={userdata.username} onChange={(e) => alert("you can not change username")} id="name"  />
              </td>
            </tr>
            <tr className="div name">
              <td>Name: </td>
              <td>
                <input type="text" value={name} id="name" onChange={(e) => setName(e.target.value)} />
              </td>
            </tr>
            <tr className="div type">
              <td>Type: </td>
              <td>
                <input type="text" onChange={(e) => alert("you can not change your type")} id="type" value={role} />
              </td>
            </tr>
            <tr className="div pic">
              <td> Profile pic : </td>
              <td>
                <input  type="file"  id="type" onChange={(e) => setoldPic(e.target.files[0])} />
              </td>
            </tr>
            <tr className="div" id='aboutyourself'>
              <td colSpan='2'>About yourself: </td>
            </tr>
            <tr>
              <td colSpan='2'>
                <textarea name="ays" id="ays" value={desc} onChange={(e) => setDesc(e.target.value)} ></textarea>
              </td>
            </tr>
            <tr>
              <td colSpan='2'>
                <button type='button' onClick={handleSignup} className="edit">Save Changes</button>
              </td>
            </tr>
            <tr>
              <td colSpan='2'>
              {
                userdata.username!="Admin"?
                <button type="button" className="edit" onClick={handleDelete}>Delete profile</button>
              :null
              }  
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  );
};

export default Editprofile;
