const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "/db/database.db");
console.log(dbPath);
app.use(express.json());

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => console.log("Server is up and running"));
  } catch (e) {
    process.exit(1);
  }
};

initializeDBAndServer();

const baseUrl = "/api";

app.get(`${baseUrl}/details`, (request, response) => {
  response.json({ users: ["userone", "usertwo", "userthree"] });
});

app.get(`${baseUrl}/stationData`, async (request, response) => {
  const query = `
    SELECT *
    FROM stations
  `;
  const data = await db.all(query);
  response.send(data);
});

app.get(`${baseUrl}/popularRoutes`, async (request, response) => {
  const query = `
    SELECT routes.route_id AS routeId,	  
       from_stations.name AS fromStation, 
       to_stations.name AS toStation,
	   distance   
    FROM routes
    INNER JOIN stations AS from_stations 
        ON routes.from_id = from_stations.station_id
    INNER JOIN stations AS to_stations 
        ON routes.to_id = to_stations.station_id
    WHERE routes.route_id IN (1, 2, 15, 19, 22, 35);
  `;
  const data = await db.all(query);
  response.json(data);
});

app.get(`${baseUrl}/getBusByRouteId/:routeId`, async (request, response) => {
  const { routeId } = request.params;
  const query = `
    SELECT *
    FROM buses
    WHERE route_id = ${routeId}
  `;
  const data = await db.all(query);
  const jsonResponse = data.map((item) => ({
    arrivalTime: item.arrival_time,
    busId: item.bus_id,
    busName: item.bus_name,
    busType: item.bus_type,
    departureTime: item.departure_time,
    fare: item.fare,
    routeId: item.route_id,
  }));
  response.json(jsonResponse);
});

app.get(`${baseUrl}/seat-availability/:busId`, async (request, response) => {
  const { busId } = request.params;
  const { travelDate } = request.query;
  const query = `
    WITH real_time_availability AS (
    SELECT booking_details.seat_number, 1 AS is_reserved
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
  LEFT JOIN 
    real_time_availability rta ON dsa.seat_number = rta.seat_number
  WHERE 
    buses.bus_id = ${busId};
    `;
  console.log(query);
  const data = await db.all(query);
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
      B2: result["B2"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B4: result["B4"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B6: result["B6"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B8: result["B8"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B10: result["B10"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B12: result["B12"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B14: result["B14"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B16: result["B16"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
      B18: result["B18"]
        ? "booked"
        : "available"
        ? "booked"
        : "available"
        ? "booked"
        : "available",
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
});
