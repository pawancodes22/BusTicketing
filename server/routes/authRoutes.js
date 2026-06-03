const { Router } = require("express");
const {
  registerController,
} = require("../controllers/authControllers/registerController");
const {
  loginController,
} = require("../controllers/authControllers/loginController");

const router = new Router();

router.post(`/register`, registerController);

router.post(`/login`, loginController);

module.exports.authRoutes = router;
