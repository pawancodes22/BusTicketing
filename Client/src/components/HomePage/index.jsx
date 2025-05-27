import NavbarComp from "../NavbarComp";
import busImage from "../../assets/busImage.jpg";
import { useEffect } from "react";
import { RiSecurePaymentLine } from "react-icons/ri";
import { RiRefund2Line } from "react-icons/ri";
import { SlEarphonesAlt } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { fetchPopularRoutes } from "../../redux/reducers/getPopularRoutes";
import SearchBus from "../SearchBus";
import "./index.css";
import { useNavigate } from "react-router-dom";
import busImg1 from "../../assets/3dBus1.jpg";
import busImg2 from "../../assets/3dBus2.jpg";
import busImg3 from "../../assets/3dBus3.jpg";
import busImg4 from "../../assets/3dBus4.jpg";
import busImg5 from "../../assets/3dBus5.jpg";
import busImg6 from "../../assets/3dBus6.jpg";
import busImg7 from "../../assets/3dBus7.jpg";

const servicesData = [
  {
    img: <RiSecurePaymentLine className="fs-3" />,
    heading: "Secure Payment",
    para: "Integrate secure payment gateways for users to pay for their tickets",
  },
  {
    img: <RiRefund2Line />,
    heading: "Refund Policy",
    para: "Offer options for the users to purchase refundable tickets with clear terms",
  },
  {
    img: <SlEarphonesAlt />,
    heading: "24/7 Support",
    para: "Get assistance anytime through chat, email or phone",
  },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { popularRoutesData, popularRoutesFetchStatus } = useSelector(
    (state) => state.getPopularRoutesReducer
  );
  console.log("popularRoutesData", popularRoutesData);

  useEffect(() => {
    dispatch(fetchPopularRoutes());
  }, [dispatch]);

  const onSearch = (sourceInput, destInput, dateOfJourney) => {
    navigate(
      `/tickets?departureStation=${sourceInput}&arrivalStation=${destInput}&travelDate=${dateOfJourney}`
    );
    // window.location.reload();
  };

  return (
    <div className="home-bg text-white">
      <NavbarComp />
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <div className="d-flex flex-column flex-lg-column flex-md-row align-items-center justify-content-center">
          {/* <div className="d-flex flex-column flex-lg-row border p-3 rounded shadow-sm mb-3">
            <div
              className="d-flex align-items-center border border-1 position-relative px-2"
              ref={sourceFieldRef}
            >
              <input
                type="text"
                placeholder="From"
                className="border-0 p-1 no-outline"
                list="from-locations"
                value={sourceInput}
                onChange={(e) => alterSourceInput(e.target.value)}
                onFocus={() => setIsSourceInFocus(true)}
                onBlur={() => setIsSourceInFocus(false)}
              />
              <FaLocationDot />
              {showSourceSuggestionBar && (
                <ul className="suggestion-container">
                  {sourceSuggestions.map((item, index) => (
                    <li
                      key={index}
                      className="station-suggestion-item"
                      onMouseDown={() => selectSourceSuggestion(item)}
                    >
                      <p className="m-0">{item.name}</p>
                      <p className="m-0">{item.code}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="align-self-center exchange-div">
              <TbArrowsExchange className="exchange-symbol" />
            </div>
            <div
              className="d-flex align-items-center border border-1 position-relative px-2"
              ref={destFieldRef}
            >
              <input
                type="text"
                placeholder="To"
                className="border-0 p-1 no-outline"
                list="from-locations"
                value={destInput}
                onChange={(e) => alterDestInput(e.target.value)}
                onFocus={() => setIsDestInFocus(true)}
                onBlur={() => setIsDestInFocus(false)}
              />
              <FaLocationDot />
              {showDestSuggestionBar && (
                <ul className="suggestion-container">
                  {destSuggestions.map((item, index) => (
                    <li
                      key={index}
                      className="station-suggestion-item"
                      onMouseDown={() => selectDestSuggestion(item)}
                    >
                      <p className="m-0">{item.name}</p>
                      <p className="m-0">{item.code}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="date"
              className="input-date border border-1 mx-0 mx-lg-3 my-4 my-lg-0 px-3 py-1"
              min={todayDate}
              value={dateOfJourney}
              onChange={(e) => alterDateOfJourney(e.target.value)}
            />
            <button className="home-search-btn">
              <FaSearch /> Search
            </button>
          </div> */}
          <SearchBus />
        </div>
        <div className="banner">
          <div className="slider" style={{ "--quantity": 7 }}>
            <div className="item" style={{ "--position": 1 }}>
              <img src={busImg1} className="bus-image" />
            </div>
            <div className="item" style={{ "--position": 2 }}>
              <img src={busImg2} className="bus-image" />
            </div>
            <div className="item" style={{ "--position": 3 }}>
              <img src={busImg3} className="bus-image" />
            </div>
            <div className="item" style={{ "--position": 4 }}>
              <img src={busImg4} className="bus-image" />
            </div>
            <div className="item" style={{ "--position": 5 }}>
              <img src={busImg5} className="bus-image" />
            </div>
            <div className="item" style={{ "--position": 6 }}>
              <img src={busImg6} className="bus-image" />
            </div>
            <div className="item" style={{ "--position": 7 }}>
              <img src={busImg7} className="bus-image" />
            </div>
          </div>
          <div className="content">
            <h1 data-content="Travel anywhere in India">
              Travel anywhere in India
            </h1>
            {/* <div className="content-para">
              <h2>Spend Less</h2>
              <p>Travel More</p>
            </div> */}
            <div className="modal-img"></div>
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center p-3 text-black">
        <h1>
          Our <span style={{ color: "#483D8B" }}>Services</span>
        </h1>
        <ul className="d-flex flex-wrap justify-content-center justify-content-md-evenly p-0">
          {servicesData.map((item, index) => (
            <li
              key={index}
              className="text-black d-flex flex-column align-items-center p-3 mb-2 me-2 service-item"
              style={{ backgroundColor: "#dadada" }}
            >
              <div className="d-flex align-items-center mb-3">
                <div className="bg-secondary p-1 px-2 rounded-2 me-2">
                  {item.img}
                </div>
                <h1 className="m-0 services-heading">{item.heading}</h1>
              </div>
              <p className="m-0 services-para">{item.para}</p>
            </li>
          ))}
        </ul>
        <h1>
          Popular <span style={{ color: "#483D8B" }}>Routes</span>
        </h1>
        <ul className="p-0 d-flex flex-wrap justify-content-between w-100 popular-routes-container">
          {popularRoutesData.map((route) => (
            <li
              key={route.routeId}
              className="list-unstyled border border-1 border-black rounded-4 p-3 mb-3 popular-route-item"
            >
              <div className="d-flex justify-content-between px-3">
                <p className="mb-2 route-heading">From</p>
                <p className="mb-2 route-heading">To</p>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <h1 className="route-text">{route.fromStation}</h1>
                <div className="d-none d-md-flex justify-content-center align-items-center max-w-[50px]">
                  <hr className="route-hr" />
                  <p className="border-1 border border-black rounded-4 m-0 route-time-para">
                    {route.distance} Kms
                  </p>
                  <hr className="route-hr" />
                </div>
                <h1 className="route-text">{route.toStation}</h1>
              </div>
              <div className="mt-3 d-flex justify-content-between justify-content-md-center align-items-center">
                <p className="d-md-none border-2 border rounded-4 m-0 route-time-para">
                  {route.distance} Kms
                </p>
                <button
                  className="text-white border-0 rounded-2 reserve-seat-btn"
                  onClick={() =>
                    onSearch(
                      route.fromStation,
                      route.toStation,
                      new Date().toISOString().split("T")[0]
                    )
                  }
                >
                  Reserve Seat
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
