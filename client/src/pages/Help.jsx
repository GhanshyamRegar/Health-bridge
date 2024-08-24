import React from 'react'
import Navigation from '../components/Navigation'

const Help = ({userId,userdata}) => {
  return (
    <div className=' lrhandler '>
        <Navigation userId={userId} userdata={userdata}/>
    <div className="about-container width">
    <h1 className="about-heading">Welcome to Health-bridge Help Center</h1>
    <p className="about-paragraph">At Health-bridge, we facilitate seamless communication between doctors and patients through our integrated chat feature. Whether you have questions about your health condition or need clarification on treatment plans, our chat functionality enables real-time interaction between you and your healthcare provider. Below are guidelines on how to utilize this feature effectively:</p>

    <div >
      <h2 className="help-heading">For Patients:</h2>
      <ol>
        <li>
          <h3 className="help-heading">Initiating a Chat:</h3>
          <p className='className="help-p'>Log in to your Health-bridge account and navigate to your dashboard. Locate the "Chat" section and click on the option to start a new conversation. Select the doctor you wish to chat with from your list of healthcare providers.</p>
        </li>
        {/* <!-- Other patient guidelines --> */}
      </ol>
    </div>

    <div >
      <h2 className='help-heading'>For Doctors:</h2>
      <ol>
        <li>
          <h3 className='help-heading'>Responding to Patient Queries:</h3>
          <p className='help-p'>Monitor incoming chat requests from patients in your dashboard. Respond promptly to patient inquiries, providing clear and concise information to address their concerns.</p>
        </li>
        {/* <!-- Other doctor guidelines --> */}
      </ol>
    </div>

    <div class="section">
      <h2 className='help-heading'>Technical Assistance:</h2>
      <p className='help-p'>Should you encounter any technical issues or difficulties while using the chat feature, our support team is readily available to assist you. Please reach out to us via email at <a href="mailto:support@health-bridge.com">support@health-bridge.com</a> for prompt resolution.</p>
    </div>

    <div class="section">
      <h2 className='help-heading'>Privacy and Security:</h2>
      <p className='help-p'>Your privacy and security are of utmost importance to us. All chat conversations are encrypted to safeguard your personal and medical information. For more details on our privacy and security measures, please refer to our Privacy Policy or contact our Data Protection Officer at <a href="mailto:dpo@health-bridge.com">dpo@health-bridge.com</a>.</p>
    </div>

    <div class="help-thanks">
      <p className='help-p'>Thank you for choosing Health-bridge! We're committed to enhancing your healthcare journey through seamless communication and personalized care.</p>
    </div>
  </div>
      
    </div>
  )
}

export default Help
