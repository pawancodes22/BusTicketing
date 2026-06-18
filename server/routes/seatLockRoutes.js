const { Router } = require("express");
const {
  deleteSeatLocksController,
} = require("../controllers/seatLocksController");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = new Router();

router.delete(`/deleteSeatLocks`, authenticateToken, deleteSeatLocksController);

module.exports.seatLocksRoutes = router;
