import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLoginData } from "../../redux/reducers/loginUser";
import logo from "../../assets/kuttyTravelLogo2.png";
import "./index.css";
import statusCodes from "../../utils/statusCodes";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Overlay from "../FUF/Overlay/Overlay";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const { loginData, loginDataPostStatus } = useSelector(
    (state) => state.loginUserReducer
  );
  const [errors, setErrors] = useState({ username: false, password: false });

  const verifyDetails = () => {
    const isLoginEmpty = loginDetails.username.trim() === "";
    const isPasswordEmpty = loginDetails.password.trim() === "";
    if (isLoginEmpty) {
      setErrors((prev) => ({ ...prev, username: true }));
    } else {
      setErrors((prev) => ({ ...prev, username: false }));
    }
    if (isPasswordEmpty) {
      setErrors((prev) => ({ ...prev, password: true }));
    } else {
      setErrors((prev) => ({ ...prev, password: false }));
    }
    return !isLoginEmpty && !isPasswordEmpty;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (verifyDetails()) {
      dispatch(postLoginData(loginDetails));
      setLoginDetails({ username: "", password: "" });
    }
  };

  useEffect(() => {
    if (loginDataPostStatus === statusCodes.success) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [loginDataPostStatus, navigate]);

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
      <div className="login-bg d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center">
        <div className="text-white mb-5 mb-md-0">
          <h1 className="fs-1 fw-bolder mb-2">Be Sure</h1>
          <p>
            Now no need to go anywhere, witness <br />
            the quality bus services with Kutty Travels Pvt. Ltd.
          </p>
        </div>
        <form className="login-form-bg" onSubmit={submitForm}>
          <img src={logo} className="logo-sizer" />
          <div>
            <input
              className="login-input-element"
              placeholder="Username"
              value={loginDetails.username}
              onChange={(e) =>
                setLoginDetails((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
            {errors.username && (
              <p className="text-danger login-module-error-text mb-0">
                *Field Required
              </p>
            )}
          </div>
          <div>
            <input
              className="login-input-element"
              placeholder="Password"
              value={loginDetails.password}
              onChange={(e) =>
                setLoginDetails((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
            {errors.username && (
              <p className="text-danger login-module-error-text mb-0">
                *Field Required
              </p>
            )}
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              className="m-auto d-block mt-2 btn btn-primary text-white rounded-2 px-5 login-button-font-size"
              type="submit"
            >
              Login
            </button>

            {loginDataPostStatus === statusCodes.error && (
              <p className="text-danger login-module-error-text mb-0">
                *{loginData}
              </p>
            )}
            {loginDataPostStatus === statusCodes.success && (
              <Overlay msg="Login successful... Redirecting to homepage" />
            )}
            <Link to="/register" className="text-white register-link">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
