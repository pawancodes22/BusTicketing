const { getDB } = require("../config/db");
const { createBooking } = require("../services/bookingService");
const { getFare } = require("../services/busService");
const {
  checkSeatLocks,
  createSeatLocks,
  deleteExpiredSeatLocks,
  deleteSeatLocks,
} = require("../services/seatLockService");
const { checkSeatAvailability } = require("../services/seatService");
const { instance } = require("../utils/PaymentInstance");
const crypto = require("crypto");

const paymentsController = async (req, res) => {
  try {
    const { userId } = req.userDetails;
    const { busId, travelDate, seatNumbers } = req.body;
    const matchedSeats = await checkSeatAvailability(
      busId,
      travelDate,
      seatNumbers,
    );
    if (matchedSeats.length !== 0) {
      const bookedSeats = matchedSeats.map((item) => item.seat_number);
      const seatsBookedError = new Error(
        `${bookedSeats.join(", ")} ${bookedSeats?.length > 1 ? "seats are" : "seat is"} already booked!`,
      );
      seatsBookedError.statusCode = 409;
      throw seatsBookedError;
    }
    await deleteExpiredSeatLocks();
    const matchedSeatLocks = await checkSeatLocks(
      busId,
      travelDate,
      seatNumbers,
    );
    if (matchedSeatLocks.length !== 0) {
      const lockedSeats = matchedSeatLocks.map((seat) => seat.seat_number);
      const seatsLockedError = new Error(
        `${lockedSeats.join(",")} ${lockedSeats?.length > 1 ? "seats are" : "seat is"} currently reserved! `,
      );
      seatsLockedError.statusCode = 409;
      throw seatsLockedError;
    }
    await createSeatLocks(busId, userId, travelDate, seatNumbers);
    const fare = await getFare(busId);
    const options = {
      amount: fare * seatNumbers.length * 100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (e) {
    console.error(e);
    return res.status(e.statusCode || 500).json({
      message: e.statusCode ? e.message : "Internal Server Error",
    });
  }
};

const getKeyController = async (req, res) => {
  return res.status(200).json({ key: process.env.RAZORPAY_API_KEY });
};

const paymentVerificationController = async (req, res) => {
  const { userId } = req.userDetails;
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    busId,
    travelDate,
    selectedSeats,
  } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;
  // console.log(`Razorpay Signature, ${razorpay_signature}`);
  // console.log(`Expected Signature ${expectedSignature}`);
  if (!isAuthentic) {
    return res.status(400).json({ message: "Payment verification failed!" });
  }
  try {
    const bookingId = await createBooking(
      userId,
      busId,
      travelDate,
      selectedSeats,
    );
    try {
      await deleteSeatLocks(busId, userId, travelDate, selectedSeats);
    } catch (e) {
      console.error(e.message);
    }
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ message: e.message || "Internal Server Error!" });
  }
  return res
    .status(200)
    .json({ success: true, message: "Booking has been created successfully!" });
};

module.exports.paymentsController = paymentsController;
module.exports.getKeyController = getKeyController;
module.exports.paymentVerificationController = paymentVerificationController;
