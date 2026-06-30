import React, { useEffect } from "react";
import { FaLongArrowAltRight, FaBusAlt } from "react-icons/fa";
import "./index.css";
import NavbarComp from "../NavbarComp";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets } from "../../redux/reducers/getTicketsByUserId";
import Footer from "../Footer";
import { useState } from "react";

const MyTickets = () => {
  const dispatch = useDispatch();
  const { ticketsData, ticketsDataFetchStatus } = useSelector(
    (state) => state.tickets,
  );
  const [isUpcomingTripsOn, setIsUpcomingTripsOn] = useState(true);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingTickets = [];
    const pastTickets = [];
    if (ticketsData) {
      ticketsData.forEach((item) => {
        const travelDate = new Date(item.departureDate);
        if (travelDate < today) {
          pastTickets.push(item);
        } else {
          upcomingTickets.push(item);
        }
      });
    }
    upcomingTickets.sort((a, b) => {
      const aDateTime = new Date(`${a.departureDate}T${a.departureTime}`);
      const bDateTime = new Date(`${b.departureDate}T${b.departureTime}`);
      return aDateTime - bDateTime;
    });
    pastTickets.sort((a, b) => {
      const aDateTime = new Date(`${a.departureDate}T${a.departureTime}`);

      const bDateTime = new Date(`${b.departureDate}T${b.departureTime}`);

      return bDateTime - aDateTime;
    });
    setUpcomingTrips(upcomingTickets);
    setPastTrips(pastTickets);
  }, [ticketsData]);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const dateFormatter = (inputDate) => {
    const date = new Date(inputDate);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const formattedDate = date
      .toLocaleDateString("en-GB", options)
      .replace(/,/g, "");
    return formattedDate;
  };

  return (
    <div className="my-tickets-bg">
      <NavbarComp />
      <div className="my-ticket-page flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5">
        <div className="tickets-second-bg rounded-4 p-2 p-md-4">
          <h1 className="text-center">
            My <span className="text-span">Tickets</span>
          </h1>
          <div className="trip-toggler">
            <button
              className={`fs-xs-6 toggler-btn-1 ${
                isUpcomingTripsOn ? "active-toggle-btn" : "inactive-toggle-btn"
              }`}
              onClick={() => setIsUpcomingTripsOn(true)}
            >
              Upcoming Trips
            </button>
            <button
              className={`toggler-btn-2 ${
                !isUpcomingTripsOn ? "active-toggle-btn" : "inactive-toggle-btn"
              }`}
              onClick={() => setIsUpcomingTripsOn(false)}
            >
              Past Trips
            </button>
          </div>
          {isUpcomingTripsOn && (
            <div>
              <h3 className="text-left mt-4 mt-md-5 sticky-top z-1">
                Upcoming <span className="text-span">Trips</span>
              </h3>

              {upcomingTrips.length > 0 ? (
                <ul className="upcoming-ul">
                  {upcomingTrips.map((ticketItem, index) => {
                    return (
                      <li
                        key={index}
                        className="list-unstyled border border-1 shadow-lg rounded-1 p-1 position-relative mb-4"
                      >
                        <div className="z-index-1 position-absolute ticket-page-bus-icon bg-white border rounded-5 d-none d-md-flex justify-content-center align-items-center">
                          <FaBusAlt />
                        </div>
                        <div className="ms-md-5 p-1 p-md-4 pb-2 d-flex flex-column flex-md-row justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <p className="mt-station fw-bold">
                                {ticketItem.departureStation}
                              </p>
                              <FaLongArrowAltRight />
                              <p className="mt-station fw-bold">
                                {ticketItem.arrivalStation}
                              </p>
                            </div>
                            <div className="d-flex align-items-center mt-bus-name">
                              {ticketItem.busName}
                            </div>
                          </div>
                          <ul className="mt-2 mt-md-0 d-flex flex-wrap gap-2 list-unstyled">
                            {ticketItem.seats.map((item, index) => (
                              <div
                                key={index}
                                className="rounded-2 p-2 text-white mt-ticket mt-seat-no"
                              >
                                {item}
                              </div>
                            ))}
                          </ul>
                        </div>
                        <hr className="my-1 shadow-sm" />
                        <div className="ms-md-5 p-1 p-md-4 pb-2 d-flex gap-5 flex-row mt-ticket justify-content-center justify-content-md-start">
                          <div>
                            <p className="text-uppercase">Departure</p>
                            <div className="d-flex gap-1">
                              <p className="fw-bold">
                                {dateFormatter(ticketItem.departureDate)}
                              </p>
                              <p>{ticketItem.departureTime}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-uppercase">Arrival</p>
                            <div className="d-flex gap-1">
                              <p className="fw-bold">
                                {dateFormatter(ticketItem.arrivalDate)}
                              </p>
                              <p>{ticketItem.arrivalTime}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center fs-5"
                  style={{ height: "70vh" }}
                >
                  No Upcoming Trips
                </div>
              )}
            </div>
          )}
          {!isUpcomingTripsOn && (
            <div>
              <h3 className="text-left mt-4 mt-md-5">
                Past <span className="text-span">Trips</span>
              </h3>
              {pastTrips.length > 0 ? (
                <ul className="past-ul">
                  {pastTrips.map((ticketItem, index) => {
                    return (
                      <li
                        key={index}
                        className="list-unstyled border border-1 shadow rounded-1 p-1 position-relative mb-4"
                      >
                        <div className="z-index-1 ticket-page-bus-icon bg-white border rounded-5 d-none d-md-flex justify-content-center align-items-center ">
                          <FaBusAlt />
                        </div>
                        <div className="ms-md-5 p-1 p-md-4 pb-2 d-flex flex-column flex-md-row justify-content-between align-items-center">
                          <div>
                            <div className="d-flex align-items-center gap-2">
                              <p className="mt-station fw-bold">
                                {ticketItem.departureStation}
                              </p>
                              <FaLongArrowAltRight />
                              <p className="mt-station fw-bold">
                                {ticketItem.arrivalStation}
                              </p>
                            </div>
                            <div className="d-flex align-items-center mt-bus-name">
                              {ticketItem.busName}
                            </div>
                          </div>
                          <ul className="mt-2 mt-md-0 d-flex flex-wrap gap-2 list-unstyled">
                            {ticketItem.seats.map((item, index) => (
                              <div
                                key={index}
                                className="rounded-2 p-2 text-white mt-ticket mt-seat-no"
                              >
                                {item}
                              </div>
                            ))}
                          </ul>
                        </div>
                        <hr className="my-1 shadow-sm" />
                        <div className="ms-md-5 p-1 p-md-4 pb-2 d-flex gap-5 flex-row mt-ticket justify-content-center justify-content-md-start">
                          <div>
                            <p className="text-uppercase">Departure</p>
                            <div className="d-flex gap-1">
                              <p className="fw-bold">
                                {dateFormatter(ticketItem.departureDate)}
                              </p>
                              <p>{ticketItem.departureTime}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-uppercase">Arrival</p>
                            <div className="d-flex gap-1">
                              <p className="fw-bold">
                                {dateFormatter(ticketItem.arrivalDate)}
                              </p>
                              <p>{ticketItem.arrivalTime}</p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center fs-5"
                  style={{ height: "70vh" }}
                >
                  No Past Trips
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyTickets;
