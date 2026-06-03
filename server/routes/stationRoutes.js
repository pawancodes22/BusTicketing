const { Router } = require("express");
const { getDB } = require("../config/db");
const { getStationsController } = require("../controllers/stationController");
const router = new Router();

router.get(`/stationData`, getStationsController);

module.exports.stationRoutes = router;
