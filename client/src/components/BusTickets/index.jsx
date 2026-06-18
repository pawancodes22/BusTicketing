import React, { useEffect, useState } from "react";
import SearchBus from "../SearchBus";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchBusesByRouteAndDate } from "../../redux/reducers/getBusesByRouteAndDate";
import { FaBus } from "react-icons/fa";
import { Link } from "react-router-dom";
import NavbarComp from "../NavbarComp";
import Footer from "../Footer";
import statusCodes from "../../utils/statusCodes";
import { Oval } from "react-loader-spinner";
import { current } from "@reduxjs/toolkit";
const BusTickets = () => {
  const dispatch = useDispatch();
  const { busesByRouteAndDateData, busesByRouteAndDateFetchStatus } =
    useSelector((state) => state.getBusesByRouteAndDateReducer);

  const [busTypeFilter, alterBusTypeFilter] = useState("");
  const [filteredBusData, setFilteredBusData] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const departureStation = queryParams.get("departureStation");
  const arrivalStation = queryParams.get("arrivalStation");
  const travelDate = queryParams.get("travelDate");
  const changeBusType = (e, busType) => {
    alterBusTypeFilter(busType);
  };

  useEffect(() => {
    const journeyDetailsJSON = {
      departureStation,
      arrivalStation,
      travelDate,
      busTypeFilter,
    };
    dispatch(fetchBusesByRouteAndDate(journeyDetailsJSON));
  }, [dispatch, busTypeFilter]);

  useEffect(() => {
    if (busesByRouteAndDateData && busesByRouteAndDateData?.length < 1) {
      return;
    }
    const currentTime = new Date().toTimeString().slice(0, 5);
    const filteredData = busesByRouteAndDateData?.filter(
      (busItem) =>
        busItem.departureTime >= currentTime && busItem.noOfSeats > 0,
    );
    setFilteredBusData(filteredData);
  }, [busesByRouteAndDateData]);

  return (
    <div className="bt-page-bg">
      <NavbarComp />
      <div className="d-flex flex-column align-items-center">
        <h1 className="text-heading my-2 fw-bold">
          Reserve Your <span className="text-span">Tickets</span>
        </h1>
        <SearchBus
          departureStation={departureStation}
          arrivalStation={arrivalStation}
          travelDate={travelDate}
        />
      </div>
      <div className="p-3 d-flex">
        <div className="d-none d-md-block">
          <h1>
            Apply <span className="text-span">Filters</span>
          </h1>
          <div className="border-2 p-2 bg-white d-flex flex-column">
            <h2>Bus Types</h2>
            <label>
              <input
                type="radio"
                className="me-2"
                name="busType"
                checked={"A/C Sleeper" === busTypeFilter}
                onChange={(e) => changeBusType(e.target.checked, "A/C Sleeper")}
              />
              <span>A/C Sleeper</span>
            </label>
            <label>
              <input
                type="radio"
                className="me-2"
                name="busType"
                checked={"Non-A/C Seater" === busTypeFilter}
                onChange={(e) =>
                  changeBusType(e.target.checked, "Non-A/C Seater")
                }
              />
              <span>Non A/C Seater</span>
            </label>
            <label>
              <input
                type="radio"
                className="me-2"
                name="busType"
                checked={"A/C Seater" === busTypeFilter}
                onChange={(e) => changeBusType(e.target.checked, "A/C Seater")}
              />
              <span>A/C Seater</span>
            </label>
            <span
              className="text-span"
              style={{ cursor: "pointer" }}
              onClick={() => alterBusTypeFilter("")}
            >
              Remove Filters
            </span>
          </div>
        </div>
        {busesByRouteAndDateFetchStatus === statusCodes.loading ||
        busesByRouteAndDateFetchStatus === statusCodes.idle ? (
          <div className="spinner-div">
            <Oval
              height={50}
              width={50}
              color="#b91c1c"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#b91c1c"
              strokeWidth={4}
              strokeWidthSecondary={4}
            />{" "}
          </div>
        ) : filteredBusData.length > 0 ? (
          <ul className="bus-items-style ps-0 ms-md-3 flex-grow-1">
            {filteredBusData &&
              filteredBusData.map((item) => (
                <li
                  key={item.busId}
                  className="bg-white border border-2 rounded-2 p-3 mb-3"
                >
                  <div className="d-flex align-items-center mb-2">
                    <FaBus className="text-danger fs-5 me-2" />
                    <h1 className="fs-5 m-0 bt-bus-name">{item.busName}</h1>
                    <p className="fs-6 ms-3 text-secondary bt-bus-type">
                      {item.busType}{" "}
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <div>
                      <p className="mb-0 bus-travel-date">
                        {item.departureDate}
                      </p>
                      <p className="fw-bold m-0 bus-travel-time">
                        {item.departureTime}
                      </p>
                      <p className="mb-0 bus-travel-station">
                        {departureStation}
                      </p>
                    </div>
                    <div className="dashed-line flex-grow-1"></div>
                    <div className="bus-line-bg rounded-5">
                      <FaBus className="text-danger" />
                    </div>
                    <div className="dashed-line flex-grow-1"></div>
                    <div>
                      <p className="mb-0 bus-travel-date">{item.arrivalDate}</p>
                      <p className="fw-bold m-0 bus-travel-time">
                        {item.arrivalTime}
                      </p>
                      <p className="mb-0 bus-travel-station">
                        {arrivalStation}
                      </p>
                    </div>
                  </div>
                  <hr className="bus-travel-hr" />
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <p className="mb-0 bus-travel-fare-seats">
                      Rs.
                      {item.fare}/per seat
                    </p>
                    <p className="mb-0  bus-travel-fare-seats">
                      <span className="text-success">{item.noOfSeats}</span>{" "}
                      seats available
                    </p>
                    <Link
                      to={`/seat-booking/${item.busId}?travelDate=${travelDate}`}
                      state={{ ...item, arrivalStation, departureStation }}
                    >
                      <button className="rounded-2 bus-reserve-seat-btn">
                        Reserve Seat
                      </button>
                    </Link>
                  </div>
                </li>
              ))}
            {/* <li className="bg-white h-100 w-100 border border-2 rounded-2 p-3">
            <div className="d-flex align-items-center mb-2">
              <FaBus className="text-danger fs-5 me-2" />
              <h1 className="fs-5 m-0 ">Kaveri Express</h1>
            </div>
            <div className="d-flex align-items-center">
              <div>
                <p className="fs-6 mb-0 bus-travel-date">21 Feb '24</p>
                <p className="fs-3 fw-bold m-0">14:00</p>
                <p className="mb-0">Visakhapatnam</p>
              </div>
              <div className="dashed-line flex-grow-1"></div>
              <div className="bus-line-bg rounded-5 fs-5">
                <FaBus className="text-danger" />
              </div>
              <div className="dashed-line flex-grow-1"></div>
              <div>
                <p className="bus-travel-date mb-0">23 Feb '24</p>
                <p className="fs-3 fw-bold m-0">06:00</p>
                <p className="mb-0">Chennai</p>
              </div>
            </div>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">Rs. 1600/per seat</p>
              <p className="mb-0">
                <span className="text-success">5</span> seats available
              </p>
              <button className="bg-danger text-white border-0 rounded-2 reserve-seat-btn">
                Reserve Seat
              </button>
            </div>
          </li> */}
          </ul>
        ) : (
          <div className="no-buses ms-md-3 flex-grow-1 rounded-2 p-3">
            <h1 className="fs-5" style={{ color: "#212529" }}>
              No buses are available for the selected route!
            </h1>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BusTickets;
