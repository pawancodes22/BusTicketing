import React from "react";
import NavbarComp from "../NavbarComp";
import tickGif from "../../assets/tickGif.gif";
import "./index.css";

const BookingSuccessPage = () => {
  return (
    <div>
      <NavbarComp />
      <div className="bsp-main-bg d-flex justify-content-center align-items-center">
        <div className="d-flex align-items-center bg-white">
          <img src={tickGif} className="tick-image-resize" />
          <p className="me-3">Booking completed successfully!</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
