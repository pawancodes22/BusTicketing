import React from "react";
import "./index.css";
import logo from "../../assets/kuttyTravelLogo6.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <img
            src={logo}
            alt="kutty travels"
            className="mx-auto w-50 w-md-100 mb-2 "
          />
          {/* <h3 className="footer-logo">KUTTY TRAVELS</h3> */}
          <p className="footer-text">
            Making your journeys smoother, safer, and faster across India.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/my-tickets">My Tickets</a>
            </li>
            {/* <li>
              <a href="/login">Login</a>
            </li> */}
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Support</h4>
          <ul>
            <li>
              <a href="#">Help Center</a>
            </li>
            <li>
              <a href="#">Refund Policy</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-heading">Contact</h4>
          <p>Email: support@kuttytravels.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Kutty Travels. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
