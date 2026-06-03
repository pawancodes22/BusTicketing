const { getDB } = require("../config/db");

const getSeatCountByBusIdController = async (request, response) => {
  const db = getDB();
  const { busId } = request.params;
  const { travelDate } = request.query;
  const query = `
    WITH real_time_availability AS (
    SELECT booking_details.seat_number, bookings.bus_id, 1 AS is_reserved
    FROM bookings 
    JOIN booking_details ON bookings.booking_id = booking_details.booking_id
    WHERE bookings.bus_id = ? AND bookings.travel_date = ?
  )
  SELECT 
    dsa.seat_number AS seatNumber, 
    COALESCE(rta.is_reserved, dsa.is_reserved) AS isReserved
  FROM 
    buses 
  JOIN 
    default_seat_availability dsa ON buses.bus_id = dsa.bus_id
  LEFT JOIN real_time_availability rta 
  ON dsa.seat_number = rta.seat_number AND dsa.bus_id = rta.bus_id
  WHERE 
    buses.bus_id = ?;
    `;
  const data = await db.all(query, [busId, travelDate, busId]);
  const reservedSeats = data.filter((item) => item.isReserved === 0);
  response.json({ noOfSeats: reservedSeats.length.toString() });
};

const getSeatAvailabilityByBusIdController = async (request, response) => {
  const db = getDB();
  const { busId } = request.params;
  const { travelDate } = request.query;
  const { userDetails } = request;
  const query = `
    WITH real_time_availability AS (
    SELECT booking_details.seat_number,bookings.bus_id, 1 AS is_reserved
    FROM bookings 
    JOIN booking_details ON bookings.booking_id = booking_details.booking_id
    WHERE bookings.bus_id = ? AND bookings.travel_date = ?
  )
  SELECT 
    dsa.seat_number AS seatNumber, 
    COALESCE(rta.is_reserved, dsa.is_reserved) AS isReserved
  FROM 
    buses 
  JOIN 
    default_seat_availability dsa ON buses.bus_id = dsa.bus_id
  LEFT JOIN real_time_availability rta 
  ON dsa.seat_number = rta.seat_number AND dsa.bus_id = rta.bus_id
  WHERE 
    buses.bus_id = ?;
    `;
  const data = await db.all(query, [busId, travelDate, busId]);
  const result = {};
  data.forEach((item) => {
    result[item.seatNumber] = item.isReserved;
  });
  const rows = {
    firstRow: {
      B1: result["B1"] ? "booked" : "available",
      B3: result["B3"] ? "booked" : "available",
      B5: result["B5"] ? "booked" : "available",
      B7: result["B7"] ? "booked" : "available",
      B9: result["B9"] ? "booked" : "available",
      B11: result["B11"] ? "booked" : "available",
      B13: result["B13"] ? "booked" : "available",
      B15: result["B15"] ? "booked" : "available",
      B17: result["B17"] ? "booked" : "available",
    },
    secondRow: {
      B2: result["B2"] ? "booked" : "available",
      B4: result["B4"] ? "booked" : "available",
      B6: result["B6"] ? "booked" : "available",
      B8: result["B8"] ? "booked" : "available",
      B10: result["B10"] ? "booked" : "available",
      B12: result["B12"] ? "booked" : "available",
      B14: result["B14"] ? "booked" : "available",
      B16: result["B16"] ? "booked" : "available",
      B18: result["B18"] ? "booked" : "available",
    },
    thirdRow: {
      A1: result["A1"] ? "booked" : "available",
      A3: result["A3"] ? "booked" : "available",
      A5: result["A5"] ? "booked" : "available",
      A7: result["A7"] ? "booked" : "available",
      A9: result["A9"] ? "booked" : "available",
      A11: result["A11"] ? "booked" : "available",
      A13: result["A13"] ? "booked" : "available",
      A15: result["A15"] ? "booked" : "available",
      A17: result["A17"] ? "booked" : "available",
    },
    fourthRow: {
      A2: result["A2"] ? "booked" : "available",
      A4: result["A4"] ? "booked" : "available",
      A6: result["A6"] ? "booked" : "available",
      A8: result["A8"] ? "booked" : "available",
      A10: result["A10"] ? "booked" : "available",
      A12: result["A12"] ? "booked" : "available",
      A14: result["A14"] ? "booked" : "available",
      A16: result["A16"] ? "booked" : "available",
      A18: result["A18"] ? "booked" : "available",
    },
  };
  response.send(rows);
};

module.exports.getSeatCountByBusIdController = getSeatCountByBusIdController;
module.exports.getSeatAvailabilityByBusIdController =
  getSeatAvailabilityByBusIdController;
