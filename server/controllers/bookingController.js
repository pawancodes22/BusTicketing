const { getDB } = require("../config/db");

const getBookedTicketsController = async (request, response) => {
  const db = getDB();
  const { userDetails } = request;
  const getBookingDetailsQuery = `SELECT bus_name AS busName, buses.bus_type AS busType, GROUP_CONCAT(booking_details.seat_number, ', ') AS seats, fare, departure_time AS departureTime, arrival_time AS arrivalTime, from_stations.name AS departureStation, to_stations.name AS arrivalStation, bookings.travel_date AS departureDate, CASE 
        WHEN arrival_time < departure_time THEN DATE(bookings.travel_date, '+1 day')
        ELSE bookings.travel_date
    END AS arrivalDate FROM bookings INNER JOIN buses ON bookings.bus_id = buses.bus_id 
INNER JOIN routes ON buses.route_id = routes.route_id INNER JOIN stations AS from_stations ON routes.from_id = from_stations.station_id 
INNER JOIN stations AS to_stations ON routes.to_id = to_stations.station_id
INNER JOIN booking_details ON booking_details.booking_id = bookings.booking_id
WHERE userId = ?
GROUP BY 
    buses.bus_id, bookings.travel_date
    ORDER BY
    bookings.travel_date DESC;
    ;`;
  const dbResponse = await db.all(getBookingDetailsQuery, [userDetails.userId]);
  const modifiedResponse = await dbResponse.map((item) => ({
    ...item,
    seats: item.seats.split(","),
  }));
  response.send(modifiedResponse);
};

const bookSeatsController = async (request, response) => {
  const db = getDB();
  const { userDetails } = request;
  const { busId, travelDate, seatNumbers } = request.body;
  const postBookingQuery = `
      INSERT INTO bookings(bus_id, travel_date, userId)
      VALUES (?, ?, ?)
    `;
  try {
    await db.run("BEGIN TRANSACTION");
    const data = await db.run(postBookingQuery, [
      busId,
      travelDate,
      userDetails.userId,
    ]);
    const bookingId = data.lastID;
    const postBookingDetailsFn = async (value) => {
      const postBookingDetailsQuery = `
      INSERT INTO booking_details(booking_id, bus_id, travel_date, seat_number)
      VALUES (?, ?, ?, ?)
    `;

      await db.run(postBookingDetailsQuery, [
        bookingId,
        busId,
        travelDate,
        value,
      ]);
    };

    for (const item of seatNumbers) {
      await postBookingDetailsFn(item);
    }
    await db.run("COMMIT");
    return response.send("Booking completed successfully");
  } catch (e) {
    await db.run("ROLLBACK");
    if (e.message.includes("UNIQUE constraint failed")) {
      return response
        .status(409)
        .send(
          "Some selected seats are no longer available. The seat map has been updated.",
        );
    }
    return response.status(500).send("Internal server error!");
  }
};

module.exports.getBookedTicketsController = getBookedTicketsController;
module.exports.bookSeatsController = bookSeatsController;
