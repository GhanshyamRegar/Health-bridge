import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import SetUser from "../SetUser";
import { app } from "../firebase";
import { imgdb } from '../firebase'
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { v4 } from "uuid"

const auth = getAuth(app);

const Signup = ({ onSignup }) => {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [role, setrole] = useState("");
  const [file, setfile] = useState("");
  const [name, setname] = useState("");
  const [pic, setpic] = useState("");
  const [password, setpassword] = useState("");
  const [desc, setdesc] = useState("");
  const [exp, setexp] = useState("");
  const [picurl, setpicurl] = useState(null);
  const [fileurl, setfileurl] = useState(null);
  const [signup, setsignup] = useState(false);


  useEffect(() => {
    const start = async()=>{

   
    const upload = async () => {

      if (pic != "") {

  
          const imgref = ref(imgdb, `files/${v4()}`)
          await uploadBytes(imgref, pic).then(async (value) => {
  
            await getDownloadURL(value.ref).then(imgurl => {
              setpicurl(imgurl)
             
            })
  
          })

      }
      if (file != "") {

  
          const imgref = ref(imgdb, `files/${v4()}`)
          await uploadBytes(imgref, file).then(async (value) => {
  
            await getDownloadURL(value.ref).then(imgurl => {
              setfileurl(imgurl)
              // console.log(fileurl);
  
            })
  
          })

      }
    }

    await upload();
    
   
  }
  start()
  }, [signup,pic,file])



  const handlerSignup = async (e) => {
    e.preventDefault();



    // Signup
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async () => {

        console.log("signUp success");
        
        setsignup(!signup)

        if (file) {
          await SetUser({
            username,
            name,
            role,
            fileurl,
            exp,
            picurl,
            email,
            password,
            desc,
          })
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.log("Error: " + error);
            });
        }
        if(pic ){
        
          await SetUser({
            username,
            name,
            role,
            picurl,
            email,
            password,
            desc,
          })
            .then((result) => {
              console.log(result);
            })
            .catch((error) => {
              console.log("Error: " + error);
            });
        }
        onSignup();
      })
      .catch((err) => {
        console.log("signUp denied");
      });

    // Reset fields
    // setemail("");
    // setpassword("");
    // setusername("");
    // setrole("");
    // setfile("");
    // setfileurl("");
    // setname("");
    // setpic("");
    // setpicurl("");
    // setdesc("");
    // setexp("");
  };

  return (
    <div>
      <form className="signup-form" onSubmit={handlerSignup}>
        <div className="signup-title">Sign Up</div>
        <div className="signup-field">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            name="username"
            id="username"
            placeholder="Enter username"
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            name="name"
            id="name"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="pic">Profile Picture:</label>
          <img src={picurl} alt="" width="200px" />
          <input
            type="file"
            // value={pic}
            onChange={(e) => setpic(e.target.files[0])}
            name="pic"
            id="pic"
            placeholder="Enter URL of your profile picture"
          />
        </div>
        <div className="signup-field">
          <label>Choose your Role:</label>
          <div>
            <label htmlFor="doctor">Doctor
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={role === "doctor"}
                onChange={(e) => setrole(e.target.value)}
                required
              />
            </label>
          </div>
          {role == "doctor" ? (
            <div className="signup-field">
              <label htmlFor="file">file </label>
              <img src={fileurl} alt="" width="200px" />
              <input
                type="file"
                onChange={(e) => setfile(e.target.files[0])}
                name="file"
                id="file"
                placeholder="enter your path of qualification certificate file"
              />
              <label htmlFor="exp">Experience </label>
              <input
                type="number"
                onChange={(e) => setexp(e.target.value)}
                name="exp"
                id="exp"
                placeholder="years of experience"
              />
            </div>

          ) : null}
          <div>
            <label htmlFor="patient">Patient
              <input
                type="radio"
                name="role"
                value="patient"
                checked={role === "patient"}
                onChange={(e) => setrole(e.target.value)}
                required
              />
            </label>
          </div>
        </div>
        <div className="signup-field">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            name="email"
            id="email"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            name="password"
            id="password"
            placeholder="Enter password"
            required
          />
        </div>
        <div className="signup-field">
          <label htmlFor="desc">About Yourself:</label>
          <textarea
            value={desc}
            onChange={(e) => setdesc(e.target.value)}
            name="desc"
            id="desc"
            placeholder="Write about yourself"
          ></textarea>
        </div>
        <button type="submit">Submit</button>
        <div className="login-link">
          Already have an account? <Link to="/">Click here to login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
