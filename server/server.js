require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const axios = require("axios");
const { authRoutes } = require("./routes/authRoutes");
const { busRoutes } = require("./routes/busRoutes");
const { seatRoutes } = require("./routes/seatRoutes");
const { bookingRoutes } = require("./routes/bookingRoutes");
const { stationRoutes } = require("./routes/stationRoutes");
const { busRouteRoutes } = require("./routes/busRouteRoutes");
const dbPath = path.join(__dirname, "/db/database.db");
const { initializeDB, getDB } = require("./config/db");

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/dist")));

// const proxy = "http://localhost:5000";

const baseUrl = "/api";

// app.get(`${baseUrl}/details`, (request, response) => {
//   response.json({ users: ["userone", "usertwo", "userthree"] });
// });

app.use(`${baseUrl}/auth`, authRoutes);
app.use(`${baseUrl}/buses`, busRoutes);
app.use(`${baseUrl}/seats`, seatRoutes);
app.use(`${baseUrl}/booking`, bookingRoutes);
app.use(`${baseUrl}/station`, stationRoutes);
app.use(`${baseUrl}/routes`, busRouteRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

initializeDB().then(() => {
  app.listen(5000, () => console.log("Server is up and running!"));
});
