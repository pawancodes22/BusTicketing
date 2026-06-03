const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

const filePath = path.join(__dirname, "..", "db", "database.db");

const initializeDB = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    });
  } catch (e) {
    console.error("Database connection error: ", db);
    process.exit(1);
  }
};

const getDB = () => db;

module.exports.initializeDB = initializeDB;
module.exports.getDB = getDB;
