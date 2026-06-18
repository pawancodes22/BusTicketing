const { getDB } = require("../config/db");

const getFare = async (busId) => {
  const db = getDB();
  const getFareQuery = `SELECT fare
FROM buses
WHERE bus_id = ?`;
  const busDetails = await db.get(getFareQuery, [busId]);
  const { fare } = busDetails;
  return fare;
};

module.exports.getFare = getFare;
