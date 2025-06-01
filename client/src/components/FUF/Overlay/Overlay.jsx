import React from "react";
import { Link } from "react-router-dom";
import "./Overlay.css";

const Overlay = ({ msg, imgUrl }) => {
  return (
    <div className="top-0 bottom-0 start-0 end-0 position-fixed z-1 d-flex justify-content-center align-items-center overlay-style">
      <div
        className={`bg-white ${
          imgUrl ? "p-2" : "p-5"
        } p-5 rounded-2 d-flex flex-column justify-content-center flex-md-row align-items-center`}
      >
        {imgUrl && <img src={imgUrl} className="w-25" />}
        <div className="align-self-stretch d-flex flex-column justify-content-center">
          <p className={`${imgUrl ? "mb-3" : ""}`}>{msg}</p>
          {imgUrl && (
            <div className="d-flex align-items-center justify-content-center">
              <Link to="/my-tickets">
                <button className="btn btn-primary me-3">My Tickets</button>
              </Link>
              <Link to="/">
                <button className="btn btn-primary">Home</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
