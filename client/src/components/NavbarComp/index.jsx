import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link } from "react-router-dom";
import profileImg from "../../assets/profileImage.png";
import logo from "../../assets/kuttyTravelLogo6.png";
import "./index.css";
import { useState } from "react";
import { getJwtToken, removeJwtToken } from "../../utils/jwtToken";
const NavbarComp = () => {
  const isUserLoggedIn = getJwtToken();
  const [toggleBarStatus, setToggleBarStatus] = useState(false);
  const onLogOut = () => {
    removeJwtToken();
    window.location.reload();
  };
  return (
    <Navbar expand="lg" className="z-4 navbar-dark">
      <Container>
        <Navbar.Brand
          href="/"
          className="fw-bolder"
          style={{ color: "#facc15" }}
        >
          <img src={logo} className="logo-sizer" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto header-items">
            {/* <Nav.Link href="#home">Home</Nav.Link> */}
            {/* <Nav.Link href="#link">Services</Nav.Link> */}
            <Nav.Link href="/my-tickets" className="text-white">
              My Tickets
            </Nav.Link>
            {/* <Nav.Link href="#about">About</Nav.Link> */}
            <div className="position-relative">
              {isUserLoggedIn ? (
                <button
                  className="border-0 rounded-4"
                  onClick={() =>
                    setToggleBarStatus((prevStatus) => !prevStatus)
                  }
                >
                  <img src={profileImg} className="nav-profile-img" />
                </button>
              ) : (
                <Link to="/login">
                  <button className="text-white border-0 sign-in-btn">
                    Sign In
                  </button>
                </Link>
              )}
              {toggleBarStatus && (
                <div
                  className="p-2 position-absolute profile-dropdown"
                  style={{ left: "-65%", bottom: "-55px" }}
                >
                  <button
                    className="logout-btn text-white border-0 rounded-2 px-3 py-1"
                    onClick={onLogOut}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;
