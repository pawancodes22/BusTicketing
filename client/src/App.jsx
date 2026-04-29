import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import BusTickets from "./components/BusTickets";
import HomePage from "./components/HomePage";
import { BrowserRouter, Routes, Route } from "react-router";
import SeatBooking from "./components/SeatBooking";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import MyTickets from "./components/MyTickets";
import BookingSuccessPage from "./components/BookingSuccessPage";
import ScrollToTop from "./utils/ScrollToTop";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tickets" element={<BusTickets />} />
        <Route
          path="/seat-booking/:busId"
          element={
            <ProtectedRoute>
              <SeatBooking />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-success"
          element={
            <ProtectedRoute>
              <BookingSuccessPage />
            </ProtectedRoute>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
