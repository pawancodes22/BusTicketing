const { Router } = require("express");
const {
  paymentsController,
  getKeyController,
  paymentVerificationController,
} = require("../controllers/paymentsController");
const { authenticateToken } = require("../middleware/authenticateToken");

const router = Router();

router.post("/process/payments", authenticateToken, paymentsController);

router.get("/getKey", authenticateToken, getKeyController);

router.post(
  "/paymentVerification",
  authenticateToken,
  paymentVerificationController,
);

module.exports.paymentRoutes = router;
