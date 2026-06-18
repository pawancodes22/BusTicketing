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
import tickImg from "../../assets/tick-img.avif";
import "./index.css";
import NavbarComp from "../NavbarComp";
import statusCodes from "../../utils/statusCodes";
import Overlay from "../FUF/Overlay/Overlay";
import { useNavigate } from "react-router-dom";
import MyVerticallyCenteredModal from "../Modal";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { toastSettings } from "../../utils/toastSettings";
import { useCallback } from "react";
import axios from "axios";
import endpoints from "../../utils/endpoints";
import Razorpay from "razorpay";
import { getJwtToken } from "../../utils/jwtToken";
const SeatBooking = () => {
  // Unified structure for seat rows
  const dispatch = useDispatch();
  const location = useLocation();
  const [paymentSuccessModal, setIsPaymentSucessModal] = useState(false);
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
  const { seatsStatus: rows } = useSelector(
    (state) => state.getSeatsAvailabilityReducer,
  );

  const { bookingData, bookingDataStatus } = useSelector(
    (state) => state.bookingReducer,
  );

  const fetchData = useCallback(async () => {
    const fetchSeatsJSON = { busId, travelDate };
    dispatch(fetchSeatsAvailability(fetchSeatsJSON));
  }, [busId, travelDate, dispatch]);

  useEffect(() => {
    if (bookingDataStatus === statusCodes.error) {
      toast.error(bookingData, toastSettings);
      fetchData();
    }
    setSelectedSeats([]);
  }, [bookingDataStatus, fetchData, bookingData]);

  useEffect(() => {
    dispatch(resetBookingState());
  }, [dispatch]);

  const typeOfSeats = [
    { name: "Available", icon: <MdOutlineChair className="available-seat" /> },
    { name: "Booked", icon: <MdOutlineChair className="booked-seat" /> },
    { name: "Selected", icon: <MdOutlineChair className="selected-seat" /> },
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
        toast.error("Maximum of 6 seats can be selected!", toastSettings);
        return;
      }
      if (rows[rowName][seatKey] === "available") {
        setSelectedSeats((prev) => [...prev, seatKey]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onCheckout = () => {
    if (selectedSeats.length < 1) {
      toast.error("Select atleast one seat to proceed!", toastSettings);
    } else {
      setModalShow(true);
    }
  };

  const checkoutHandler = async (amount) => {
    try {
      let isPaymentCompleted = false;
      const jwtToken = getJwtToken();
      const postBookingDetailsJSON = {
        busId: Number(busId),
        travelDate,
        seatNumbers: selectedSeats,
      };
      const { data } = await axios.get(endpoints.getRazorpayKeyEndpoint, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const { key: razorpayKey } = data;
      const { data: orderData } = await axios.post(
        endpoints.paymentProcessEndpoint,
        {
          ...postBookingDetailsJSON,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        },
      );
      const { order } = orderData;
      const options = {
        key: razorpayKey,
        amount,
        currency: "INR",
        name: "Kutty Travels",
        description: "Tickets Booking",
        order_id: order.id, // This is the order_id created in the backend
        // callback_url: endpoints.paymentVerificationEndpoint, // Your success URL
        handler: async function (response) {
          try {
            const verificationResponse = await axios.post(
              endpoints.paymentVerificationEndpoint,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                busId,
                travelDate,
                selectedSeats,
              },
              {
                headers: {
                  Authorization: `Bearer ${jwtToken}`,
                },
              },
            );
            setIsPaymentSucessModal(true);
            isPaymentCompleted = true;
          } catch (e) {
            console.error(e);
            toast.error("Payment verification failed", toastSettings);
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              if (!isPaymentCompleted) {
                await axios.delete(endpoints.deleteSeatLocksEndpoint, {
                  headers: {
                    Authorization: `Bearer ${jwtToken}`,
                  },
                  data: {
                    busId,
                    travelDate,
                    seatNumbers: selectedSeats,
                  },
                });
                toast.error("Payment has been cancelled!", toastSettings);
              }
            } catch (e) {
              console.error(e);
            }
          },
        },
        prefill: {
          name: "Gaurav Kumar",
          // email: "gaurav.kumar@example.com",
          // contact: "9999999999",
        },
        theme: {
          color: "#F37254",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      const errorMessage =
        e.response?.data?.message || "Error occured while booking seats!";
      toast.error(errorMessage, toastSettings);
      if (e.response?.status === 409) {
        await fetchData();
        setSelectedSeats([]);
      }
    }
  };

  const onConfirm = async () => {
    try {
      const { fare } = busDetails;
      const noOfSeats = selectedSeats.length;
      await checkoutHandler(fare * noOfSeats);
    } catch (e) {
      console.error("Error while booking in frontend", e.message);
    }
  };

  return (
    <div className="seat-booking-bg">
      <NavbarComp />
      {paymentSuccessModal && (
        <Overlay
          imgUrl={tickImg}
          msg={
            "Your booking is confirmed. You can view your tickets in “My Tickets”."
          }
        />
      )}
      <div className="seat-booking-container d-flex flex-column justify-content-center">
        <h1 className="select-seats-heading text-center my-3">
          Select your <span className="text-span">Seats</span>
        </h1>
        <div className="d-flex flex-column justify-content-center flex-grow-1">
          <div className="d-flex flex-column flex-xl-row align-items-center justify-content-around seat-booking-div p-2">
            <div className="mw-100 overflow-x-auto ">
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
                            className={` ${seats[seatKey] === "booked" ? "booked-seat" : "available-seat"} d-flex align-items-center justify-content-end me-2 me-md-4 seat-item`}
                            onClick={() => {
                              if (seats[seatKey] !== "booked") {
                                selectSeat(rowName, seatKey);
                              }
                            }}
                          >
                            <span>{seatKey}</span>
                            <MdOutlineChair
                              className={`seat-icon ${
                                seats[seatKey] === "booked" ? "" : ""
                              } ${
                                selectedSeats.includes(seatKey)
                                  ? "selected-seat"
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
                      <li
                        key={index}
                        className="d-flex align-items-center mx-2"
                      >
                        {item.icon}
                        <p className="m-0 ms-2 seat-type-para">{item.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div id="checkout-box" className="checkout-container flex-grow-1">
              <div className="d-flex align-items-center justify-content-between fw-bold mb-3">
                <p className="mb-0 fs-5">
                  Checkout <span className="text-span">Summary</span>
                </p>
                {/* <Link to="/" className="change-route-text text-decoration-none">
                Change Route
              </Link> */}
              </div>
              <div className="d-flex align-items-center flex-grow-1 mb-4">
                <div className="d-flex align-items-center flex-column">
                  <p className="m-0 ">From</p>
                  <p className="m-0 fw-bold">{departureStation}</p>
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
                  <p className="m-0 ">To</p>
                  <p className="m-0 fw-bold">{arrivalStation}</p>
                  <div className="d-flex justify-between align-items-center flex-column flex-md-row small-date-time-text">
                    <p className="m-0 me-2 small-date-time-text ">
                      {arrivalTime}
                    </p>
                    <p className="m-0 me-2 small-date-time-text">
                      {arrivalDate}
                    </p>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <p className="fw-semibold fs-5">Selected Seats</p>
                {/* <p className="mb-1 text-uppercase non-refundable-text p-2 fw-semibold rounded-4">
                Non-Refundable
              </p> */}
              </div>
              {selectedSeats.length > 0 ? (
                <ul className="mb-4 p-0 d-flex justify-content-start mt-2">
                  {selectedSeats.map((item, index) => (
                    <li key={index} className="styled-list">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ height: "60px" }}>No seat selected</p>
              )}
              <div>
                <p className="fw-semibold mb-1 fs-5">Fare Details</p>
                <div className="d-flex justify-content-between">
                  <p>Basic Fare:</p>
                  <p>₹ {fare}</p>
                </div>
              </div>
              <div className="mt-3 total-price-comp">
                <p className="fw-semibold mb-1 fs-5">Total Price</p>
                <div className="d-flex justify-content-between align-items-center">
                  <p className="fs-6">(including all taxes)</p>
                  <p className="fs-5">₹ {selectedSeats.length * fare}</p>
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
      <Footer />
    </div>
  );
};

export default SeatBooking;
