const { getDB } = require("../config/db");

const getSeatCount = async (busId, travelDate) => {
  const db = getDB();
  const query = `
    WITH real_time_availability AS (
    SELECT booking_details.seat_number, bookings.bus_id, 1 AS is_reserved
    FROM bookings 
    JOIN booking_details ON bookings.booking_id = booking_details.booking_id
    WHERE bookings.bus_id = ${busId} AND bookings.travel_date = '${travelDate}'
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
    buses.bus_id = ${busId};
  `;
  const data = await db.all(query);
  const reservedSeats = data.filter((item) => item.isReserved === 0);
  return { noOfSeats: reservedSeats.length.toString() };
};

module.exports.getSeatCount = getSeatCount;
