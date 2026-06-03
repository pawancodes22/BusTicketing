const { Router } = require("express");
const { getDB } = require("../config/db");
const busRouteController = require("../controllers/busRouteController");

const router = Router();

router.get(`/popularRoutes`, busRouteController);

module.exports.busRouteRoutes = router;
