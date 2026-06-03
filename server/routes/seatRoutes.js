const {
  getSeatCountByBusIdController,
  getSeatAvailabilityByBusIdController,
} = require("../controllers/seatController");
const { getDB } = require("../config/db");
const { Router } = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = new Router();

router.get(`/seat-count/:busId`, getSeatCountByBusIdController);

router.get(
  `/seat-availability/:busId`,
  authenticateToken,
  getSeatAvailabilityByBusIdController,
);

module.exports.seatRoutes = router;
