const { getDB } = require("../config/db");

const createBooking = async (userId, busId, travelDate, seatNumbers) => {
  const db = getDB();
  const postBookingQuery = `
      INSERT INTO bookings(bus_id, travel_date, userId)
      VALUES (?, ?, ?)
    `;
  try {
    await db.run("BEGIN TRANSACTION");
    const data = await db.run(postBookingQuery, [busId, travelDate, userId]);
    const bookingId = data.lastID;
    const postBookingDetailsQuery = `
      INSERT INTO booking_details(booking_id, bus_id, travel_date, seat_number)
      VALUES (?, ?, ?, ?)
    `;

    for (const seatNumber of seatNumbers) {
      await db.run(postBookingDetailsQuery, [
        bookingId,
        busId,
        travelDate,
        seatNumber,
      ]);
    }
    await db.run("COMMIT");
    return {
      bookingId,
    };
  } catch (e) {
    await db.run("ROLLBACK");
    if (e.message.includes("UNIQUE constraint failed")) {
      const error = new Error(
        "Some selected seats are no longer available. The seat map has been updated.",
      );

      error.statusCode = 409;
      throw error;
    }
    throw e;
  }
};

module.exports.createBooking = createBooking;
