import { Link } from "react-router-dom";
import img from "../img/logo.png"
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src={img} alt="Your Company Logo" className="logo-img" />
        </div>
        <div className="footer-links">
          <Link to="/About" className="footer-link">About</Link>
          <Link to="/Explore" className="footer-link">Explore</Link>
          <Link to="/help" className="footer-link">help</Link>
        </div>
        <div className="footer-social">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link">GitHub</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">LinkedIn</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copy">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
