import React, { useState } from "react";
import { GiSteeringWheel } from "react-icons/gi";
import { MdOutlineChair } from "react-icons/md";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import "./index.css";

const SeatBooking = () => {
  // Unified structure for seat rows
  const rows = {
    firstRow: {
      B1: "booked",
      B3: "booked",
      B5: "booked",
      B7: "available",
      B9: "available",
      B11: "booked",
      B13: "booked",
      B15: "available",
      B17: "available",
    },
    secondRow: {
      B2: "booked",
      B4: "booked",
      B6: "booked",
      B8: "available",
      B10: "available",
      B12: "booked",
      B14: "booked",
      B16: "available",
      B18: "available",
    },
    thirdRow: {
      A1: "booked",
      A3: "booked",
      A5: "booked",
      A7: "available",
      A9: "available",
      A11: "booked",
      A13: "booked",
      A15: "available",
      A17: "available",
    },
    fourthRow: {
      A2: "booked",
      A4: "booked",
      A6: "booked",
      A8: "available",
      A10: "available",
      A12: "booked",
      A14: "booked",
      A16: "available",
      A18: "available",
    },
  };

  const perSeatPrice = 1600;

  const typeOfSeats = [
    { name: "Available", icon: <MdOutlineChair className="text-success" /> },
    { name: "Booked", icon: <MdOutlineChair className="text-danger" /> },
    { name: "Selected", icon: <MdOutlineChair className="text-warning" /> },
    {
      name: `${perSeatPrice} /-`,
      icon: <TbCoinRupeeFilled className="fs-5" />,
    },
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const selectSeat = (rowName, seatKey) => {
    if (selectedSeats.includes(seatKey)) {
      setSelectedSeats((prev) => prev.filter((item) => item !== seatKey));
    } else {
      if (selectedSeats.length === 6) {
        alert("Maximum of 6 seats can only be booked at a time");
        return;
      }
      if (rows[rowName][seatKey] === "available") {
        setSelectedSeats((prev) => [...prev, seatKey]);
      }
    }
  };

  return (
    <div className="d-flex flex-column flex-xl-row align-items-center justify-content-around seat-booking-div p-2">
      <div className="mw-100 overflow-x-auto ">
        <div
          id="seats"
          className="border border-2 border-secondary m-2 ms-0 ms-md-2 p-2 seats-div"
        >
          <p className="text-center text-secondary">
            Click on available seats to reserve your seat.
          </p>
          <div className="d-flex" id="seats-booking">
            <GiSteeringWheel className="steering-icon text-danger" />
            <div className="driver-seats-divider"></div>
            <div>
              {Object.entries(rows).map(([rowName, seats], rowIndex) => (
                <ul key={rowIndex} className="d-flex mb-5">
                  {Object.keys(seats).map((seatKey, index) => (
                    <li
                      key={index}
                      className="d-flex align-items-center justify-content-end me-2 me-md-4 seat-item"
                      onClick={() => selectSeat(rowName, seatKey)}
                    >
                      <span>{seatKey}</span>
                      <MdOutlineChair
                        className={`seat-icon ${
                          seats[seatKey] === "booked" ? "text-danger" : ""
                        } ${
                          selectedSeats.includes(seatKey) ? "text-warning" : ""
                        }`}
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
          <div className="mt-2 dashed-border border-secondary"></div>
          <div className="d-flex justify-content-center align-items-center p-0 mt-2">
            <ul className="d-flex align-items-center mb-0">
              {typeOfSeats.map((item, index) => (
                <li key={index} className="d-flex align-items-center mx-2">
                  {item.icon}
                  <p className="m-0 ms-2 seat-type-para">{item.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        id="checkout-box"
        className="checkout-container border border-2 border-secondary p-2 flex-grow-1"
      >
        <div className="d-flex align-items-center justify-content-between fw-bold mb-3">
          <p className="mb-0">Your Destination</p>
          <Link
            to="/"
            className="change-route-text text-danger text-decoration-none"
          >
            Change Route
          </Link>
        </div>
        <div className="d-flex align-items-center flex-grow-1 mb-3">
          <div>
            <p className="m-0">From</p>
            <p className="m-0">Visakhapatnam</p>
          </div>
          <hr className="flex-grow-1 hr-border-style mx-4 flex-grow-1" />
          <div>
            <p className="m-0">To</p>
            <p className="m-0">Vijayawada</p>
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <p className="fw-semibold mb-1">Selected Seats</p>
          <p className="mb-1 text-uppercase non-refundable-text p-2 fw-semibold rounded-4">
            Non-Refundable
          </p>
        </div>
        {selectedSeats.length > 0 ? (
          <ul className="p-0 d-flex justify-content-start mt-2">
            {selectedSeats.map((item, index) => (
              <li key={index} className="styled-list">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p>No seat selected</p>
        )}
        <div>
          <p className="fw-semibold mb-2">Fare Details</p>
          <div className="d-flex justify-content-between">
            <p>Basic Fare:</p>
            <p>₹ {perSeatPrice}</p>
          </div>
        </div>
        <div>
          <p className="fw-semibold mb-2">Total Price</p>
          <div className="d-flex justify-content-between">
            <p>(including all taxes)</p>
            <p>₹ {selectedSeats.length * perSeatPrice}</p>
          </div>
        </div>
        <button className="checkout-btn">Proceed to checkout</button>
      </div>
    </div>
  );
};

export default SeatBooking;
