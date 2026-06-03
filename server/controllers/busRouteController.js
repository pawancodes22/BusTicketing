const { getDB } = require("../config/db");

const busRouteController = async (request, response) => {
  const db = getDB();
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
};

module.exports = busRouteController;
