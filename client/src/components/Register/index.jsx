import React, { useEffect, useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import {
  postUserData,
  resetRegisterSlice,
} from "../../redux/reducers/registerUser";
import logo from "../../assets/kuttyTravelLogo6.png";
import statusCodes from "../../utils/statusCodes";
import { Link, useNavigate } from "react-router-dom";
import Overlay from "../FUF/Overlay/Overlay";
import { toastSettings } from "../../utils/toastSettings";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { registerData, registerDataFetchStatus } = useSelector(
    (state) => state.registerUserReducer,
  );
  const [formDetails, setFormDetails] = useState({
    name: "",
    username: "",
    password: "",
    gender: "Male",
  });
  const [errors, setErrors] = useState({
    name: false,
    username: false,
    password: false,
  });
  const verifyDetails = () => {
    const newErrors = {
      name: formDetails.name === "",
      username: formDetails.username === "",
      password: formDetails.password === "",
    };
    setErrors(newErrors);
    return !newErrors.name && !newErrors.username && !newErrors.password;
  };
  const submitForm = (e) => {
    e.preventDefault();
    if (verifyDetails()) {
      dispatch(postUserData(formDetails));
      // setFormDetails({ username: "", name: "", password: "", gender: "Male" });
    }
  };

  useEffect(() => {
    if (registerDataFetchStatus === statusCodes.success) {
      toast.success("Account created successfully", toastSettings);
      navigate("/login");
    }
  }, [registerDataFetchStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetRegisterSlice());
    };
  }, []);

  return (
    <>
      <Link to="/">
        <button
          className="register-back-btn position-absolute rounded-2 bg-transparent border-0 text-decoration-underline"
          style={{ top: "20px", left: "20px" }}
        >
          Back
        </button>
      </Link>
      <div className="register-bg d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center">
        <div className="text-white">
          <h1 className="register-hero-title">
            Start your journey, <span> Traveler</span>
          </h1>
          <p className="register-hero-subtitle">
            Start exploring routes across India with ease.
          </p>
        </div>
        <form className="register-form-bg" onSubmit={submitForm}>
          <img src={logo} className="register-logo-sizer mb-4" />
          <input
            className={`register-input-element ${
              errors.username ? "" : "mb-3"
            }`}
            placeholder="Username"
            value={formDetails.username}
            onChange={(e) =>
              setFormDetails((prev) => ({ ...prev, username: e.target.value }))
            }
          />
          {errors.username && (
            <p className="text-danger mb-0 login-module-error-text mb-2">
              *Field Required
            </p>
          )}
          <input
            className={`register-input-element ${errors.name ? "" : "mb-3"}`}
            placeholder="Name"
            value={formDetails.name}
            onChange={(e) =>
              setFormDetails((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          {errors.name && (
            <p className="text-danger mb-0 register-module-error-text mb-2">
              *Field Required
            </p>
          )}
          <input
            className={`register-input-element ${
              errors.password ? "" : "mb-3"
            }`}
            placeholder="Password"
            value={formDetails.password}
            onChange={(e) =>
              setFormDetails((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          {errors.password && (
            <p className="text-danger mb-0 login-module-error-text mb-2">
              *Field Required
            </p>
          )}
          <div className="d-flex flex-md-row text-white">
            <label className="me-4 d-flex align-items-center">
              <input
                type="radio"
                name="Gender"
                value="Male"
                className="me-1"
                checked={formDetails.gender === "Male"}
                onChange={(e) =>
                  setFormDetails((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
              Male
            </label>
            <label className="me-4 d-flex align-items-center">
              <input
                type="radio"
                name="Gender"
                value="Female"
                className="me-1"
                checked={formDetails.gender === "Female"}
                onChange={(e) =>
                  setFormDetails((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
              Female
            </label>
            <label className="d-flex align-items-center">
              <input
                type="radio"
                name="Gender"
                value="Others"
                className="me-1"
                checked={formDetails.gender === "Others"}
                onChange={(e) =>
                  setFormDetails((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
              Others
            </label>
          </div>
          <div className="d-flex flex-column align-items-center">
            <button className="register-button-style m-auto d-block mt-2 btn text-white rounded-2 px-5">
              Register
            </button>
            {registerDataFetchStatus === statusCodes.error && (
              <p className="text-danger mb-0 login-module-error-text mb-2">
                *{registerData}
              </p>
            )}
            <Link to="/login" className="text-white login-link">
              Login
            </Link>
          </div>
        </form>
      </div>
      {registerDataFetchStatus === statusCodes.success && (
        <Overlay msg="Registration successful... Redirecting to login page" />
      )}
    </>
  );
};

export default Register;
