require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbPath = path.join(__dirname, "/db/database.db");
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));
// const proxy = "http://localhost:5000";

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(PORT, () =>
      console.log(`Server is up and running on port ${PORT}`)
    );
  } catch (e) {
    process.exit(1);
  }
};

initializeDBAndServer();

const baseUrl = "/api";

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.userDetails = payload;
        next();
      }
    });
  }
};

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
    WHERE routes.route_id IN (1, 2, 15, 8, 3, 9);
  `;
  const data = await db.all(query);
  response.json(data);
});

app.get(`${baseUrl}/getBusesByRouteAndDate`, async (request, response) => {
  const {
    departureStation,
    arrivalStation,
    travelDate,
    busType,
    minPrice,
    maxPrice,
  } = request.query;
  const getRouteIdQuery = `
    SELECT route_id, ds.name AS departure_station, ars.name AS arrival_station FROM routes INNER JOIN stations ds ON routes.from_id = ds.station_id INNER JOIN stations ars ON routes.to_id = ars.station_id
    WHERE ds.name='${departureStation}' AND ars.name='${arrivalStation}'
  `;
  const data = await db.get(getRouteIdQuery);
  const { route_id: routeId } = data;
  const filters = [`route_id=${routeId}`];
  if (busType) filters.push(`bus_type='${busType}'`);
  if (maxPrice) filters.push(`fare <= ${maxPrice}`);
  if (minPrice) filters.push(`fare >= ${minPrice}`);
  const query = `
    SELECT *
    FROM buses
    WHERE ${filters.join(" AND ")}
  `;
  const busesData = await db.all(query);
  const jsonResponse = await Promise.all(
    busesData.map(async (item) => {
      const departureDate = new Date(`${travelDate} ${item.departure_time}`);
      const arrivalDate = new Date(`${travelDate} ${item.arrival_time}`);
      if (arrivalDate.getTime() < departureDate.getTime()) {
        arrivalDate.setDate(arrivalDate.getDate() + 1);
      }
      const formattedDepartureDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }).format(departureDate);

      const formattedArrivalDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }).format(arrivalDate);

      // const dataWithSeatsAvailability = data.map((item) => {

      // return {
      //   arrivalTime: item.arrival_time,
      //   busId: item.bus_id,
      //   busName: item.bus_name,
      //   busType: item.bus_type,
      //   departureTime: item.departure_time,
      //   fare: item.fare,
      //   routeId: item.route_id,
      //   noOfSeats: fetchNoOfSeats(bus_id),
      // };

      const fetchNoOfSeats = async () => {
        const seatsResponse = await axios.get(
          `/api/seat-count/${item.bus_id}?travelDate=${travelDate}`
        );
        return seatsResponse.data.noOfSeats;
      };

      const noOfSeats = Number(await fetchNoOfSeats());

      return {
        arrivalTime: item.arrival_time,
        busId: item.bus_id,
        busName: item.bus_name,
        busType: item.bus_type,
        departureTime: item.departure_time,
        fare: item.fare,
        routeId: item.route_id,
        departureDate: formattedDepartureDate,
        arrivalDate: formattedArrivalDate,
        noOfSeats,
      };
    })
  );
  response.json(jsonResponse);
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

app.get(
  `${baseUrl}/seat-availability/:busId`,
  authenticateToken,
  async (request, response) => {
    const { busId } = request.params;
    const { travelDate } = request.query;
    const { userDetails } = request;
    const query = `
    WITH real_time_availability AS (
    SELECT booking_details.seat_number,bookings.bus_id, 1 AS is_reserved
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
  }
);

app.get(`${baseUrl}/seat-count/:busId`, async (request, response) => {
  const { busId } = request.params;
  const { travelDate } = request.query;
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
  response.json({ noOfSeats: reservedSeats.length.toString() });
});

app.post(`${baseUrl}/register`, async (request, response) => {
  const { username, name, password, gender } = request.body;
  const isUserExistsQuery = `
    SELECT *
    FROM user
    WHERE username='${username}'
  `;
  const isUserExists = await db.get(isUserExistsQuery);
  if (isUserExists) {
    response.status(400);
    response.send("User already exists");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const postUserDataQuery = `
      INSERT INTO user(username, name, password, gender)
      VALUES(
        '${username}', '${name}', '${hashedPassword}', '${gender}'
      )
    `;
    await db.run(postUserDataQuery);
    response.send("User Created Successfully");
  }
});

app.post(`${baseUrl}/login`, async (request, response) => {
  const { username, password } = request.body;
  const getUserQuery = `
    SELECT * FROM user WHERE username = '${username}'
  `;
  const dbUser = await db.get(getUserQuery);
  if (dbUser) {
    const isPasswordTrue = await bcrypt.compare(password, dbUser.password);
    if (isPasswordTrue) {
      const payload = { userId: dbUser.id, username };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Password is incorrect");
    }
  } else {
    response.status(400);
    response.send(`User doesn't exists`);
  }
});

app.post(
  `${baseUrl}/bookSeats`,
  authenticateToken,
  async (request, response) => {
    const { userDetails } = request;
    const { busId, travelDate, seatNumbers } = request.body;
    const postBookingQuery = `
      INSERT INTO bookings(bus_id, travel_date, userId)
      VALUES (${busId}, '${travelDate}', ${userDetails.userId})
    `;
    const data = await db.run(postBookingQuery);
    const bookingId = data.lastID;
    const postBookingDetailsFn = async (value) => {
      const postBookingDetailsQuery = `
      INSERT INTO booking_details(booking_id, seat_number)
      VALUES (${bookingId}, '${value}')
    `;
      await db.run(postBookingDetailsQuery);
    };
    seatNumbers.forEach((item) => {
      postBookingDetailsFn(item);
    });
    response.send("Booking completed successfully");
  }
);

app.get(
  `${baseUrl}/getBookedTickets`,
  authenticateToken,
  async (request, response) => {
    const { userDetails } = request;
    const getBookingDetailsQuery = `SELECT bus_name AS busName, buses.bus_type AS busType, GROUP_CONCAT(booking_details.seat_number, ', ') AS seats, fare, departure_time AS departureTime, arrival_time AS arrivalTime, from_stations.name AS departureStation, to_stations.name AS arrivalStation, bookings.travel_date AS departureDate, CASE 
        WHEN arrival_time < departure_time THEN DATE(bookings.travel_date, '+1 day')
        ELSE bookings.travel_date
    END AS arrivalDate FROM bookings INNER JOIN buses ON bookings.bus_id = buses.bus_id 
INNER JOIN routes ON buses.route_id = routes.route_id INNER JOIN stations AS from_stations ON routes.from_id = from_stations.station_id 
INNER JOIN stations AS to_stations ON routes.to_id = to_stations.station_id
INNER JOIN booking_details ON booking_details.booking_id = bookings.booking_id
WHERE userId = ${userDetails.userId}
GROUP BY 
    buses.bus_id, bookings.travel_date
    ORDER BY
    bookings.travel_date DESC;
    ;`;
    const dbResponse = await db.all(getBookingDetailsQuery);
    const modifiedResponse = await dbResponse.map((item) => ({
      ...item,
      seats: item.seats.split(","),
    }));
    response.send(modifiedResponse);
  }
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});
