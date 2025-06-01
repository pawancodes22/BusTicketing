import React, { useEffect } from "react";
import { FaLongArrowAltRight, FaBusAlt } from "react-icons/fa";
import "./index.css";
import NavbarComp from "../NavbarComp";
import { useDispatch, useSelector } from "react-redux";
import { fetchTickets } from "../../redux/reducers/getTicketsByUserId";

const MyTickets = () => {
  const dispatch = useDispatch();
  const { ticketsData, ticketsDataFetchStatus } = useSelector(
    (state) => state.tickets
  );
  console.log("the tickets data is", ticketsData);
  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);
  const tickets = [
    {
      departureStation: "Visakhapatnam",
      arrivalStation: "Duvvada",
      busName: "Garuda Travels",
      departureDate: "15 Dec 2025",
      arrivalDate: "18 Dec 2025",
      departureTime: "12:00AM",
      arrivalTime: "18:00PM",
      busType: "A/C Sleeper",
      seats: ["A1", "B3", "B6"],
    },
    {
      departureStation: "Hyderabad",
      arrivalStation: "Bangalore",
      busName: "Orange Tours",
      departureDate: "20 Dec 2025",
      arrivalDate: "20 Dec 2025",
      departureTime: "22:00AM",
      arrivalTime: "06:00PM",
      busType: "Non A/C Seater",
      seats: ["A1", "B3", "B6"],
    },
    {
      departureStation: "Chennai",
      arrivalStation: "Coimbatore",
      busName: "KPN Travels",
      departureDate: "25 Dec 2025",
      arrivalDate: "26 Dec 2025",
      departureTime: "23:30AM",
      arrivalTime: "05:45PM",
      busType: "A/C Seater",
      seats: ["A1", "B3", "B6"],
    },
    {
      departureStation: "Vijayawada",
      arrivalStation: "Tirupati",
      busName: "APSRTC",
      departureDate: "28 Dec 2025",
      arrivalDate: "29 Dec 2025",
      departureTime: "21:00AM",
      arrivalTime: "04:30PM",
      busType: "Non A/C Sleeper",
      seats: ["A1", "B3", "B6"],
    },
    {
      departureStation: "Mumbai",
      arrivalStation: "Pune",
      busName: "Neeta Travels",
      departureDate: "30 Dec 2025",
      arrivalDate: "30 Dec 2025",
      departureTime: "07:00AM",
      arrivalTime: "10:00PM",
      busType: "A/C Sleeper",
      seats: ["A1", "B3", "B6"],
    },
  ];

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
      <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5">
        <ul className="tickets-second-bg rounded-4 list-unstyled p-4">
          <h1 className="text-center text-violet">My Tickets</h1>
          {ticketsData.length > 0 ? (
            ticketsData.map((ticketItem, index) => {
              return (
                <li
                  key={index}
                  className="list-unstyled border border-1 custom-bluish-shadow rounded-1 p-1 position-relative my-4"
                >
                  <div className="z-index-1 position-absolute ticket-page-bus-icon bg-white border rounded-5 d-flex justify-content-center align-items-center">
                    <FaBusAlt />
                  </div>
                  <div className="ms-md-5 p-4 pb-2 d-flex flex-column flex-md-row justify-content-between align-items-center">
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
                      {console.log(ticketItem.seats)}
                      {ticketItem.seats.map((item, index) => (
                        <div
                          key={index}
                          className="bg-primary rounded-2 p-2 text-white mt-ticket"
                        >
                          {item}
                        </div>
                      ))}
                    </ul>
                  </div>
                  <hr className="my-1 shadow-sm" />
                  <div className="ms-md-5 p-4 pb-2 d-flex gap-5 flex-row mt-ticket justify-content-center justify-content-md-start">
                    <div>
                      <p className="text-uppercase">From</p>
                      <div className="d-flex gap-1">
                        <p className="fw-bold">
                          {dateFormatter(ticketItem.departureDate)}
                        </p>
                        <p>{ticketItem.departureTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-uppercase">To</p>
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
            })
          ) : (
            <div
              className="d-flex justify-content-center align-items-center fs-5"
              style={{ height: "70vh" }}
            >
              No Ticket Bought Yet
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MyTickets;
