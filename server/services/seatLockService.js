const { getDB } = require("../config/db");

const deleteExpiredSeatLocks = async () => {
  const db = getDB();
  const deleteOldSeatLocksQuery = `
      DELETE FROM seat_locks
      WHERE expires_at < ?;
    `;
  const now = new Date().toISOString();
  const result = await db.run(deleteOldSeatLocksQuery, [now]);
  return result;
};

const checkSeatLocks = async (busId, travelDate, seatNumbers) => {
  const db = getDB();
  const placeholders = seatNumbers.map(() => "?").join(",");

  const isSeatLockDoneQuery = `
      SELECT *
      FROM seat_locks
      WHERE bus_id=? AND travel_date=? AND seat_number IN (${placeholders}) 
    `;
  const matchedSeatLocks = await db.all(isSeatLockDoneQuery, [
    busId,
    travelDate,
    ...seatNumbers,
  ]);
  return matchedSeatLocks;
};

const createSeatLocks = async (busId, userId, travelDate, seatNumbers) => {
  const db = getDB();
  const setLockQuery = `
        INSERT INTO seat_locks(bus_id, user_id, travel_date, 
        seat_number, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `;
  const expiresAtValue = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  try {
    await db.run("BEGIN TRANSACTION");
    for (let seat of seatNumbers) {
      await db.run(setLockQuery, [
        busId,
        userId,
        travelDate,
        seat,
        expiresAtValue,
      ]);
    }
    await db.run("COMMIT");
  } catch (e) {
    await db.run("ROLLBACK");
    if (e.message.includes("UNIQUE constraint failed")) {
      const uniqueConstraintError = new Error(
        "Some seats were reserved by another user.",
      );
      uniqueConstraintError.statusCode(409);
      throw uniqueConstraintError;
    }
    throw e;
  }
};

const deleteSeatLocks = async (busId, userId, travelDate, seatNumbers) => {
  const db = getDB();
  const placeholder = seatNumbers.map((item) => "?").join(",");
  const deleteQuery = `
        DELETE FROM seat_locks
        WHERE
        bus_id=? AND user_id=? AND travel_date=? AND seat_number IN (${placeholder})
    `;

  await db.run(deleteQuery, [busId, userId, travelDate, ...seatNumbers]);
};

module.exports.deleteExpiredSeatLocks = deleteExpiredSeatLocks;
module.exports.checkSeatLocks = checkSeatLocks;
module.exports.createSeatLocks = createSeatLocks;
module.exports.deleteSeatLocks = deleteSeatLocks;
