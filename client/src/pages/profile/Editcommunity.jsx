import React, { useEffect, useState } from 'react';
import "../style/userprofile.css";
import { doc, setDoc, deleteDoc, updateDoc, getDocs, query, collection, where, arrayRemove } from 'firebase/firestore';
import { db, imgdb } from '../../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import Getcomdetail from './Getcomdetail';

const Editcommunity = ({ userdata, userId }) => {

  const [logo, setlogo] = useState(null);
  const [currentindex, setcurrentindex] = useState(null);

  const [formDataList, setFormDataList] = useState([]);

  useEffect(() => {

    const upload = async () => {
    
        // console.log(currentindex)
        // console.log(formDataList)
        const imgref = ref(imgdb, `files/${v4()}`)
        await uploadBytes(imgref, logo).then(async (value) => {

          await getDownloadURL(value.ref).then(imgurl => {
            const updatedFormDataList = [...formDataList];
            const nestedData = updatedFormDataList[currentindex].data;
            nestedData.communitilogo= imgurl;
            setFormDataList(updatedFormDataList);
            
          })
          
        })
        console.log(currentindex)
        console.log(formDataList[currentindex])
      

    }
    if(logo!=null)
    upload();



    const fetchCommunity = async () => {
      try {
        const fetchdata = await Getcomdetail(userId);

        if (fetchdata) {
          setFormDataList(fetchdata);
        } else {
          alert("User have no community");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchCommunity();
  }, [logo]);

  const changeHandler = (index, e) => {
    const updatedFormDataList = [...formDataList];
    const nestedData = updatedFormDataList[index].data;
    nestedData[e.target.name] = e.target.value;
    setFormDataList(updatedFormDataList);
  };

  const submitHandler = async (e, index) => {
    e.preventDefault();
    try {
      const commId = formDataList[index].id;
      const commRef = doc(db, 'community', commId);
      await updateDoc(commRef, formDataList[index].data);
      alert("Changes saved successfully.");
    } catch (err) {
      alert(err);
    }
  };

  const deleteHandler = async (index) => {
    try {
      const commId = formDataList[index].id;

      // Delete all post associated with the community
      const postSnapshot = await getDocs(query(collection(db, 'post'), where('communityId', '==', commId)));
      const deletepostPromises = postSnapshot.docs.map((postDoc) => deleteDoc(doc(db, 'post', postDoc.id)));

      // Delete all comments associated with the community
      const commentsSnapshot = await getDocs(query(collection(db, 'comments'), where('communityId', '==', commId)));
      const deleteCommentsPromises = commentsSnapshot.docs.map((commentDoc) => deleteDoc(doc(db, 'comments', commentDoc.id)));

      // Wait for all delete operations to complete
      await Promise.all([...deletepostPromises, ...deleteCommentsPromises]);

      // Delete the community
      const commRef = doc(db, 'community', commId);
      await deleteDoc(commRef);

      // Update the communities array in users table
      const updatedFormDataList = [...formDataList];
      updatedFormDataList.splice(index, 1);
      setFormDataList(updatedFormDataList);

      // Update the communities array in the user's document
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
    <div>
      {formDataList.map((data, index) => (
        <form key={index} onSubmit={(e) => submitHandler(e, index)}>
          <div className='usercont height' key={index}>
            <h1>Edit Community</h1>
            <img src={data.data.communitilogo} alt="not available" />

            <table className='divtable' key={index}>
              <tbody>
                <tr className="div name">
                  <td>Name: </td>
                  <td>
                    <input type="text" id={`name-${index}`} name='name' value={data.data.name} onChange={(e) => changeHandler(index, e)} />
                  </td>
                </tr>

                <tr className="div pic">
                  <td> Profile pic : </td>
                  <td>
                    <input type="file" id={`pic-${index}`} name='communitilogo' onChange={(e) => { setlogo(e.target.files[0]); setcurrentindex(index) }} />
                  </td>
                </tr>

                <tr className="div" id='aboutyourself'>
                  <td colSpan='2'>About community: </td>
                </tr>
                <tr>
                  <td colSpan='2'>
                    <textarea className="w-75 rounded-3 p-3" name="communitydesc" id={`ays-${index}`} value={data.data.communitydesc} onChange={(e) => changeHandler(index, e)}></textarea>
                  </td>
                </tr>
                <tr>
                  <td colSpan='2'>
                    <button type='submit' className="edit">Save Changes</button>
                  </td>
                  <td>
                    <button type='button' onClick={() => deleteHandler(index)} className=" rounded-2 bg-danger">Delete Community</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      ))}
    </div>
  );
};

export default Editcommunity;
