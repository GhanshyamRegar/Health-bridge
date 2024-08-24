import React from 'react';
import Navigation from '../components/Navigation';

const About = ({ userId, userdata }) => {
  return (

    <div className="about-container lrhandler">
      <Navigation userId={userId} userdata={userdata} />
      <div>
        <div className="about-container width">
          <h1 className="about-heading">About Health-bridge</h1>
          <p className="about-paragraph">Health-bridge is a revolutionary platform that aims to bridge the gap between doctors and patients, providing a seamless healthcare experience. Our mission is to empower individuals to take control of their health and connect them with qualified healthcare professionals.</p>

          <h2 className="about-subheading">Interactive Chat Feature</h2>
          <p className="about-paragraph">Incorporating a doctor-patient chat feature into Health-bridge adds an interactive and personalized touch to the healthcare experience. Whether you have questions about your health condition, need clarification on treatment plans, or require urgent medical advice, our chat functionality enables real-time interaction between you and your healthcare provider.</p>

          <div className="about-feature-list">
            <div className="about-feature-item">
              <h3 className="about-subheading">For Patients:</h3>
              <ol className="about-list">
                <li>Initiate a chat with your doctor through your Health-bridge account dashboard.</li>
                <li>Engage in real-time conversations to discuss symptoms, ask questions, or seek advice.</li>
                <li>Rest assured that all chat conversations are confidential and secure, complying with healthcare data regulations.</li>
                <li>Continue the conversation for follow-up queries or additional guidance from your doctor.</li>
              </ol>
            </div>
            <div className="about-feature-item">
              <h3 className="about-subheading">For Doctors:</h3>
              <ol className="about-list">
                <li>Monitor incoming chat requests from patients in your dashboard.</li>
                <li>Respond promptly to patient inquiries, providing clear and concise information.</li>
                <li>Offer clinical guidance, answer medical questions, and provide reassurance to patients.</li>
                <li>Assist patients with appointment scheduling and address urgent medical situations.</li>
              </ol>
            </div>
          </div>

          <h2 className="about-subheading">Contact Us</h2>
          <p className="about-paragraph">For any inquiries or feedback about Health-bridge, please don't hesitate to <a href="contact.html" className="about-link">contact us</a>. We value your input and are committed to providing the best possible healthcare experience for our users.</p>

          <div className="about-thanks">
            <p className="about-paragraph">Thank you for choosing Health-bridge! We're dedicated to revolutionizing healthcare delivery and improving patient outcomes through innovative technology.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
