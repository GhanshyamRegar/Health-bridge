import Midright from "./components/Midright"
import Navbar from "./components/Navbar"
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom"
import "./app.css"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import { useEffect, useState } from "react"
import Getuser from "./Getuser"
import { arrayUnion, collection, getDocs, query, updateDoc, where } from "firebase/firestore"
import { db } from "./firebase"
import Footer from "./pages/Footer"
import Uploadimg from "./Uploadimg"


const App = () => {

  const [isloggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useState("");
  const [userdata, setUserdata] = useState({});
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setisadmin] = useState(false);
  const [searchuserdata, setsearchUserdata] = useState({});
  
  const [imgfile, setimgfile] = useState("");



  useEffect(() => {

    // Fetch username when logged in
    const fetchData = async () => {
      if (email) {

        Getuser(email).then(async ({ userData, userId }) => {

          setUserdata(userData);
          setUserId(userId);

          if (userData.role === "doctor" && !userData.verify) {
            const usercoll = collection(db, 'users');
            const adminref = await getDocs(query(usercoll, where("username", "==", "Admin")));

            await updateDoc(adminref.docs[0].ref, {
              pendingDoctors: arrayUnion({ username: userData.username, userId: userId })
            })
          }
        }).catch(error => {
          console.log('Error: ' + error);
        });
      }


      if (email == "Admin@gmail.com") {
        setisadmin(true);
      }
    }

    if (isloggedIn) {
      fetchData();
    }
  }, [isloggedIn]);      //dependency Array


  //function to handle loggin true
  const handleLoginOrSignup = async (useremail) => {
    setIsLoggedIn(true);
    setEmail(useremail);
    console.log("logged in")

  }

  const handleSignup = () => {
    console.log("signup in")
    window.location.href = "/";
  }


  const changeUser = (cuserId, cuserdata) => {
    setUserId(cuserId);
    console.log(cuserdata)
    setUserdata(cuserdata);
  }

  const searchUserSet = (searchuser)=>{
    setsearchUserdata(searchuser)
  }

  return (

    <Router>

      <Navbar admin={isAdmin} userId={userId} searchUserSet={searchUserSet} userdata={userdata} userDatarole={userdata.role} username={userdata.username} />
      {isloggedIn ? (
        <>
          <div className="lrhandler">
            <Midright userId={userId} searchuserdata={searchuserdata} changeUser={changeUser} userdata={userdata} />

          </div>
        </>
      ) :
        (
          <div>
            <Routes>
              <Route index path="/" element={<Login onLoginOrSignup={handleLoginOrSignup} />} />
              <Route path='/Signup' element={<Signup onSignup={handleSignup} />} />

              <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to login for unknown paths */}
            </Routes>
          </div>
        )

      }
      <Footer/>

    </Router>


  )
}

export default App
