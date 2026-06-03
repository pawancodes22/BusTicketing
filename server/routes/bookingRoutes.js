const { Router } = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const { getDB } = require("../config/db");
const {
  getBookedTicketsController,
  bookSeatsController,
} = require("../controllers/bookingController");

const router = new Router();

router.get(`/getBookedTickets`, authenticateToken, getBookedTicketsController);

router.post(`/bookSeats`, authenticateToken, bookSeatsController);

module.exports.bookingRoutes = router;
