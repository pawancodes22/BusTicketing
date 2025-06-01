import { FaLocationDot } from "react-icons/fa6";
import { TbArrowsExchange } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStations } from "../../redux/reducers/getStationsData";
import { useNavigate } from "react-router-dom";
import "./index.css";

const SearchBus = ({ departureStation, arrivalStation, travelDate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stationData, getStationDataStatus } = useSelector(
    (state) => state.getStationsReducer
  );
  const [sourceInput, alterSourceInput] = useState("");
  console.log("source input changed to ", sourceInput);
  const [showSourceSuggestionBar, alterShowSourceSuggestionBar] =
    useState(false);
  const [isSourceInFocus, setIsSourceInFocus] = useState(false);
  const sourceFieldRef = useRef(null);
  const [showDestSuggestionBar, alterShowDestSuggestionBar] = useState(false);
  const [destInput, alterDestInput] = useState("");
  const destSuggestions = useMemo(() => {
    return stationData.filter((item) => {
      return (
        item.name.toLowerCase().includes((destInput || "").toLowerCase()) &&
        item.name.toLowerCase() !== sourceInput.toLowerCase()
      );
    });
  }, [destInput, sourceInput, stationData]);
  const [isDestInFocus, setIsDestInFocus] = useState(false);
  const destFieldRef = useRef(null);
  const sourceSuggestions = useMemo(() => {
    return stationData.filter((item) => {
      return (
        item.name.toLowerCase().includes(sourceInput.toLowerCase()) &&
        item.name.toLowerCase() !== destInput.toLowerCase()
      );
    });
  }, [sourceInput, destInput, stationData]);

  const dateInput = () => {
    const todayDate = new Date();
    const year = String(todayDate.getFullYear());
    const month = String(todayDate.getMonth() + 1).padStart(2, "0");
    const day = String(todayDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayDate = dateInput();

  const [dateOfJourney, alterDateOfJourney] = useState(travelDate || todayDate);

  useEffect(() => {
    if (
      Array.isArray(sourceSuggestions) &&
      sourceSuggestions.length > 0 &&
      isSourceInFocus
    ) {
      alterShowSourceSuggestionBar(true);
    } else {
      alterShowSourceSuggestionBar(false);
    }
  }, [sourceInput, sourceSuggestions, isSourceInFocus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sourceFieldRef.current &&
        !sourceFieldRef.current.contains(event.target)
      ) {
        const isInputASelectedOne = !stationData.some(
          (item) => item.name.toLowerCase() === sourceInput.toLowerCase()
        );
        if (isInputASelectedOne) {
          console.log("inside stationData", stationData);
          alterSourceInput(stationData[0].name);
        }
        alterShowSourceSuggestionBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sourceInput, stationData]);

  const selectSourceSuggestion = (item) => {
    alterSourceInput(item.name);
    alterShowSourceSuggestionBar(false);
  };

  useEffect(() => {
    if (
      Array.isArray(destSuggestions) &&
      destSuggestions.length > 0 &&
      isDestInFocus
    ) {
      alterShowDestSuggestionBar(true);
    } else {
      alterShowDestSuggestionBar(false);
    }
  }, [destInput, destSuggestions, isDestInFocus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sourceFieldRef.current &&
        !sourceFieldRef.current.contains(event.target)
      ) {
        const isInputASelectedOne = !stationData.some(
          (item) => item.name.toLowerCase() === sourceInput.toLowerCase()
        );
        if (isInputASelectedOne) {
          alterSourceInput(stationData[0].name);
        }
        alterShowSourceSuggestionBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sourceInput, stationData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        destFieldRef.current &&
        !destFieldRef.current.contains(event.target)
      ) {
        const isInputASelectedOne = !stationData.some(
          (item) => item.name.toLowerCase() === destInput.toLowerCase()
        );
        if (isInputASelectedOne) {
          alterDestInput(stationData[1].name);
        }
        alterShowDestSuggestionBar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [destInput, stationData]);

  const selectDestSuggestion = (item) => {
    alterDestInput(item.name);
    alterShowDestSuggestionBar(false);
  };

  dateInput();

  useEffect(() => {
    dispatch(fetchStations());
  }, [dispatch]);

  useEffect(() => {
    alterSourceInput(
      stationData.length > 0 ? departureStation || stationData[0].name : ""
    );
    alterDestInput(
      stationData.length > 0 ? arrivalStation || stationData[1].name : ""
    );
  }, [stationData]);

  const onSearch = () => {
    navigate(
      `/tickets?departureStation=${sourceInput}&arrivalStation=${destInput}&travelDate=${dateOfJourney}`,
      { replace: true }
    );
    window.location.reload();
  };

  return (
    <div className="z-3 search-bus-bg d-flex flex-column flex-lg-row border p-3 rounded shadow-sm mb-3">
      <div
        className="text-black d-flex align-items-center justify-content-between border border-1 position-relative px-2"
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
        className="text-black d-flex align-items-center justify-content-between border border-1 position-relative px-2"
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
      <button className="home-search-btn" onClick={onSearch}>
        <FaSearch /> Search
      </button>
    </div>
  );
};

export default SearchBus;
