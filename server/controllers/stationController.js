const { getDB } = require("../config/db");

const getStationsController = async (request, response) => {
  const db = getDB();
  const query = `
    SELECT *
    FROM stations
  `;
  const data = await db.all(query);
  response.send(data);
};

module.exports.getStationsController = getStationsController;
