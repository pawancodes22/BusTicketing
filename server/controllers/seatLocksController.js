const { deleteSeatLocks } = require("../services/seatLockService");

const deleteSeatLocksController = async (req, res) => {
  try {
    const { userId } = req.userDetails;
    const { busId, travelDate, seatNumbers } = req.body;
    await deleteSeatLocks(busId, userId, travelDate, seatNumbers);
    return res.status(200).json({
      success: true,
      message: "Seat locks have been deleted successfully!",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error!" });
  }
};

module.exports.deleteSeatLocksController = deleteSeatLocksController;
