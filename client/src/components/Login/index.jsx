import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postLoginData, resetLoginSlice } from "../../redux/reducers/loginUser";
import logo from "../../assets/kuttyTravelLogo6.png";
import "./index.css";
import statusCodes from "../../utils/statusCodes";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Overlay from "../FUF/Overlay/Overlay";
import { toast } from "react-toastify";
import { toastSettings } from "../../utils/toastSettings";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });
  const { loginData, loginDataPostStatus } = useSelector(
    (state) => state.loginUserReducer,
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
    // let timer;
    // if (loginDataPostStatus === statusCodes.success) {
    //   timer = setTimeout(() => {
    //     navigate("/");
    //   }, 3000);
    // }
    // return () => {
    //   clearTimeout(timer);
    // };
    if (loginDataPostStatus === statusCodes.success) {
      toast.success("Logged in successfully", toastSettings);
      navigate("/");
    }
  }, [loginDataPostStatus, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetLoginSlice());
    };
  }, [dispatch]);

  return (
    <>
      <Link to="/">
        <button
          className="login-back-text z-2 position-absolute rounded-2 bg-transparent border-0 text-decoration-underline"
          style={{ top: "20px", left: "20px" }}
        >
          Back
        </button>
      </Link>
      <div className="login-bg d-flex flex-column flex-md-row justify-content-center justify-content-md-between align-items-center">
        <div className="text-white mb-md-5 ">
          <h1 class="hero-title">
            Welcome back,
            <span> Traveler</span>
          </h1>

          <p class="hero-subtitle">Your next journey is just a login away.</p>
        </div>
        <form className="login-form-bg" onSubmit={submitForm}>
          <img src={logo} className="logo-sizer mb-4" />
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
            {errors.password && (
              <p className="text-danger login-module-error-text mb-0">
                *Field Required
              </p>
            )}
          </div>
          <div className="d-flex flex-column align-items-center">
            <button
              className="m-auto d-block mt-2 mb-1 btn text-white rounded-2 px-5 login-button-style"
              type="submit"
            >
              Login
            </button>

            {loginDataPostStatus === statusCodes.error && (
              <p className="text-danger login-module-error-text mb-0">
                *{loginData}
              </p>
            )}
            <Link to="/register" className="text-white register-link">
              Register
            </Link>
          </div>
        </form>
      </div>
      {/* {loginDataPostStatus === statusCodes.success && (
        <Overlay msg="Login successful... Redirecting to homepage" />
      )} */}
    </>
  );
};

export default Login;
