import React, { useState } from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { postUserData } from "../../redux/reducers/registerUser";
import logo from "../../assets/kuttyTravelLogo2.png";
import statusCodes from "../../utils/statusCodes";
import { Link } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const { registerData, registerDataFetchStatus } = useSelector(
    (state) => state.registerUserReducer
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
    if (formDetails.name === "") {
      setErrors((error) => ({ ...error, name: true }));
    } else {
      setErrors((error) => ({ ...error, name: false }));
    }
    if (formDetails.username === "") {
      setErrors((error) => ({ ...error, username: true }));
    } else {
      setErrors((error) => ({ ...error, username: false }));
    }
    if (formDetails.password === "") {
      setErrors((error) => ({ ...error, password: true }));
    } else {
      setErrors((error) => ({ ...error, password: false }));
    }
    return !errors.name && !errors.username && !errors.password;
  };
  const submitForm = (e) => {
    e.preventDefault();
    if (verifyDetails()) {
      dispatch(postUserData(formDetails));
      setFormDetails({ username: "", name: "", password: "", gender: "" });
    }
  };
  return (
    <>
      <Link to="/">
        <button
          className="position-absolute rounded-2 text-white bg-transparent border-0 text-decoration-underline"
          style={{ top: "20px", left: "20px" }}
        >
          Back
        </button>
      </Link>
      <div className="register-bg d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center">
        <div className="text-white">
          <h1 className="fs-1 fw-bolder mb-2">Be Sure</h1>
          <p>
            Now no need to go anywhere, witness <br />
            the quality bus services with Kutty Travels Pvt. Ltd.
          </p>
        </div>
        <form className="register-form-bg" onSubmit={submitForm}>
          <img src={logo} className="logo-sizer mb-2" />
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
          <div className="d-flex flex-md-row">
            <label className="me-4 ">
              <input
                type="radio"
                name="Gender"
                value="Male"
                className="me-1"
                defaultChecked
                onChange={(e) =>
                  setFormDetails((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
              Male
            </label>
            <label className="me-4">
              <input
                type="radio"
                name="Gender"
                value="Female"
                className="me-1"
                onChange={(e) =>
                  setFormDetails((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="Gender"
                value="Others"
                className="me-1"
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
            <button className="register-button-font-size m-auto d-block mt-2 btn btn-primary text-white text-uppercase rounded-5 px-5">
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
    </>
  );
};

export default Register;
