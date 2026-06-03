const { getDB } = require("../config/db");
const { getSeatCount } = require("../services/seatService");

const getBusByRouteAndDateController = async (request, response) => {
  const db = getDB();
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
    WHERE ds.name=? AND ars.name=?
  `;
  const data = await db.get(getRouteIdQuery, [
    departureStation,
    arrivalStation,
  ]);
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
        const seatsResponse = await getSeatCount(item.bus_id, travelDate);
        // const seatsResponse = await axios.get(
        //   `/api/seat-count/${item.bus_id}?travelDate=${travelDate}`
        // );
        return seatsResponse.noOfSeats;
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
    }),
  );
  response.json(jsonResponse);
};

const getBusByRouteIdController = async (request, response) => {
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
};

module.exports.getBusByRouteAndDateController = getBusByRouteAndDateController;
module.exports.getBusByRouteIdController = getBusByRouteIdController;
