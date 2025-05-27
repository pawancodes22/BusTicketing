import React, { useEffect, useState } from "react";
import { GiSteeringWheel } from "react-icons/gi";
import { MdOutlineChair } from "react-icons/md";
import { TbCoinRupeeFilled } from "react-icons/tb";
import { Link, useLocation, useParams } from "react-router-dom";
import { fetchSeatsAvailability } from "../../redux/reducers/getSeatsAvailabilityByBusId";
import { resetBookingState } from "../../redux/reducers/bookSeatsByUserId";
import { bookSeats } from "../../redux/reducers/bookSeatsByUserId";
import { useDispatch, useSelector } from "react-redux";
import tickGif from "../../assets/tickGif.gif";
import "./index.css";
import NavbarComp from "../NavbarComp";
import statusCodes from "../../utils/statusCodes";
import Overlay from "../FUF/Overlay/Overlay";
import { useNavigate } from "react-router-dom";
import MyVerticallyCenteredModal from "../Modal";
const SeatBooking = () => {
  // Unified structure for seat rows
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const busDetails = location.state;
  const {
    arrivalDate,
    arrivalTime,
    busName,
    busType,
    departureDate,
    departureTime,
    fare,
    noOfSeats,
    arrivalStation,
    departureStation,
  } = busDetails;
  const { busId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const travelDate = queryParams.get("travelDate");
  const { seatsStatus: rows, seatsAvailabilityFetchStatus } = useSelector(
    (state) => state.getSeatsAvailabilityReducer
  );

  const { bookingData, bookingDataStatus } = useSelector(
    (state) => state.bookingReducer
  );

  useEffect(() => {
    if (bookingDataStatus === statusCodes.success) {
      // fetchData();
      // setTimeout(() => {
      //   navigate("/");
      // }, 3000);
    }
    setSelectedSeats([]);
  }, [bookingDataStatus]);

  useEffect(() => {
    dispatch(resetBookingState());
  }, [dispatch]);

  // const rows = {
  //   firstRow: {
  //     B1: "booked",
  //     B3: "booked",
  //     B5: "booked",
  //     B7: "available",
  //     B9: "available",
  //     B11: "booked",
  //     B13: "booked",
  //     B15: "available",
  //     B17: "available",
  //   },
  //   secondRow: {
  //     B2: "booked",
  //     B4: "booked",
  //     B6: "booked",
  //     B8: "available",
  //     B10: "available",
  //     B12: "booked",
  //     B14: "booked",
  //     B16: "available",
  //     B18: "available",
  //   },
  //   thirdRow: {
  //     A1: "booked",
  //     A3: "booked",
  //     A5: "booked",
  //     A7: "available",
  //     A9: "available",
  //     A11: "booked",
  //     A13: "booked",
  //     A15: "available",
  //     A17: "available",
  //   },
  //   fourthRow: {
  //     A2: "booked",
  //     A4: "booked",
  //     A6: "booked",
  //     A8: "available",
  //     A10: "available",
  //     A12: "booked",
  //     A14: "booked",
  //     A16: "available",
  //     A18: "available",
  //   },
  // };

  const typeOfSeats = [
    { name: "Available", icon: <MdOutlineChair className="text-success" /> },
    { name: "Booked", icon: <MdOutlineChair className="text-danger" /> },
    { name: "Selected", icon: <MdOutlineChair className="text-warning" /> },
    {
      name: `${fare} /-`,
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

  const fetchData = async () => {
    const fetchSeatsJSON = { busId, travelDate };
    dispatch(fetchSeatsAvailability(fetchSeatsJSON));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onCheckout = () => {
    // const postBookingDetailsJSON = {
    //   busId: Number(busId),
    //   travelDate,
    //   seatNumbers: selectedSeats,
    // };
    // dispatch(bookSeats(postBookingDetailsJSON));
    if (selectedSeats.length < 1) {
      alert("Select atleast one seat to proceed!");
    } else {
      setModalShow(true);
    }
  };

  const onConfirm = () => {
    const postBookingDetailsJSON = {
      busId: Number(busId),
      travelDate,
      seatNumbers: selectedSeats,
    };
    dispatch(bookSeats(postBookingDetailsJSON));
  };

  return (
    <div className="seat-booking-bg">
      <NavbarComp />
      {bookingDataStatus === statusCodes.success && (
        <Overlay
          imgUrl={tickGif}
          msg={`Booking successfully Done!, You can check your tickets under my tickets tab`}
        />
      )}
      <h1 style={{ color: "#483D8B" }} className="text-center my-3">
        Book Your Seats
      </h1>
      <div></div>
      <div className="d-flex flex-column justify-content-center flex-grow-1">
        <div className="d-flex flex-column flex-xl-row align-items-start justify-content-around seat-booking-div p-2">
          <div className="shadow-lg mw-100 overflow-x-auto ">
            <div
              id="seats"
              className="border border-2 border-secondary ms-0 ms-md-2 p-2 seats-div"
            >
              <p className="text-center text-secondary">
                Click on available seats to reserve your seat.
              </p>
              <div className="d-flex" id="seats-booking">
                <GiSteeringWheel className="steering-icon text-danger" />
                <div className="driver-seats-divider"></div>
                <div>
                  {Object.entries(rows).map(([rowName, seats], rowIndex) => (
                    <ul
                      key={rowIndex}
                      className={`d-flex ${
                        rowName === "secondRow" ? "mb-5" : "mb-2"
                      }`}
                    >
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
                              selectedSeats.includes(seatKey)
                                ? "text-warning"
                                : ""
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
            className="shadow-lg checkout-container border border-2 border-secondary p-2 flex-grow-1"
          >
            <div className="d-flex align-items-center justify-content-between fw-bold mb-3">
              <p className="mb-0">Your Destination</p>
              <Link to="/" className="change-route-text text-decoration-none">
                Change Route
              </Link>
            </div>
            <div className="d-flex align-items-center flex-grow-1 mb-3">
              <div className="d-flex align-items-center flex-column">
                <p className="m-0 fw-bold">From</p>
                <p className="m-0">{departureStation}</p>
                <div className="d-flex justify-between align-items-center flex-column flex-md-row">
                  <p className="m-0 me-2 small-date-time-text                                   ">
                    {departureTime}
                  </p>
                  <p className="m-0 me-2 small-date-time-text">
                    {departureDate}
                  </p>
                </div>
              </div>
              <hr className="flex-grow-1 hr-border-style mx-4 flex-grow-1" />
              <div className="d-flex align-items-center flex-column">
                <p className="m-0 fw-bold">To</p>
                <p className="m-0">{arrivalStation}</p>
                <div className="d-flex justify-between align-items-center flex-column flex-md-row small-date-time-text">
                  <p className="m-0 me-2 small-date-time-text ">
                    {arrivalTime}
                  </p>
                  <p className="m-0 me-2 small-date-time-text">{arrivalDate}</p>
                </div>
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
                <p>₹ {fare}</p>
              </div>
            </div>
            <div>
              <p className="fw-semibold mb-2">Total Price</p>
              <div className="d-flex justify-content-between">
                <p>(including all taxes)</p>
                <p>₹ {selectedSeats.length * fare}</p>
              </div>
            </div>
            <button className="checkout-btn my-4" onClick={onCheckout}>
              Proceed to checkout
            </button>
            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              busDetails={busDetails}
              selectedSeats={selectedSeats}
              onConfirm={onConfirm}
              bookingDataStatus={bookingDataStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBooking;
