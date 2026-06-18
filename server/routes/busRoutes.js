const { Router } = require("express");

const {
  getBusByRouteAndDateController,
  getBusByRouteIdController,
} = require("../controllers/busController");

const router = new Router();

router.get(`/getBusesByRouteAndDate`, getBusByRouteAndDateController);

router.get(`/getBusByRouteId/:routeId`, getBusByRouteIdController);

module.exports.busRoutes = router;
