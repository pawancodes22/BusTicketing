const { Router } = require("express");
const {
  registerController,
} = require("../controllers/authControllers/registerController");
const {
  loginController,
} = require("../controllers/authControllers/loginController");
const { authenticateToken } = require("../middleware/authenticateToken");
const {
  getUserController,
} = require("../controllers/authControllers/userDetailsController");

const router = new Router();

router.post(`/register`, registerController);

router.post(`/login`, loginController);

router.get(`/getUser`, authenticateToken, getUserController);

module.exports.authRoutes = router;
