import React from "react";
import { Link } from "react-router-dom";
import "./Overlay.css";

const Overlay = ({ msg, imgUrl }) => {
  return (
    <div className="overlay-wrapper">
      <div className="overlay-card">
        <div className="success-icon">
          {imgUrl && <img src={imgUrl} alt="success" />}
        </div>

        <h3 className="overlay-title">Booking Confirmed</h3>

        <p className="overlay-text">{msg}</p>

        <div className="overlay-actions">
          <Link to="/my-tickets">
            <button className="primary-btn">My Tickets</button>
          </Link>

          <Link to="/">
            <button className="secondary-btn">Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Overlay;
