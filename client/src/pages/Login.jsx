import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { Link } from 'react-router-dom';

const auth = getAuth(app); // Creating auth instance

const Login = ({ onLoginOrSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signupuser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((value) => {
        onLoginOrSignup(email);
        console.log('sign IN success');
      })
      .catch((err) => {
        console.log('signIn denied');
        console.log(err);
        alert(err);
      });
  };

  return (
    <div className="login-container"> 
      <form className="login-form" onSubmit={signupuser}>  
        <div className="login-title">  
          Login
        </div>
        <div className="input-container">  
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            name="email"
            id="email"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="input-container">  
          <label htmlFor="pass">Password: </label>
          <input
            type="password" /* Change type to password */
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            name="password" /* Change name to password */
            id="pass"
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit">Login</button>
        <div className="signup-link">  
          Don't have an account? <Link to="/Signup">Click here</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
