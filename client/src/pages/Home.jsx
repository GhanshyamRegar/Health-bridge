import React from 'react';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';

const Home = ({ userId, userdata }) => {
  return (
    <div className="lrhandler height">
      <Navigation userId={userId} userdata={userdata} />
      <div className='mr'>

        {/* Header Section */}
        <header className="home-header ">
          <h1>Welcome to Our Psychological Support Platform</h1>
          <p style={{ fontSize: '1.25rem' }}>Helping you overcome depression and find support.</p>
          <Link to="/Explore">
           <button className="btn btn-light btn-lg">Get Started</button>
          </Link>
        </header>

        <div >
          <div>
            <div className='mtop' >
              <h2 className="about-heading">About Us</h2>
              <p className="about-paragraph"> We are dedicated to providing a safe space for individuals suffering from psychological issues such as depression. Our platform offers chat support and a community where you can find understanding and encouragement.</p>
            </div>
            <div className="mtop">
              <h2 className="about-heading">How We Can Help</h2>
              <p className="about-paragraph">Our experienced team of counselors and volunteers are here to listen and support you through your journey. Whether you need someone to talk to or resources to help you cope, we're here for you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
