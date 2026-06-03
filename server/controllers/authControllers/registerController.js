const { getDB } = require("../../config/db");
const bcrypt = require("bcrypt");

const registerController = async (request, response) => {
  const db = getDB();
  const { username, name, password, gender } = request.body;
  const isUserExistsQuery = `
    SELECT *
    FROM user
    WHERE username=?
  `;
  try {
    const isUserExists = await db.get(isUserExistsQuery, [username]);
    if (isUserExists) {
      response.status(400);
      response.send("User already exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const postUserDataQuery = `
      INSERT INTO user(username, name, password, gender)
      VALUES(
        ?, ?, ?, ?
      )
    `;
      await db.run(postUserDataQuery, [username, name, hashedPassword, gender]);
      response.send("User Created Successfully");
    }
  } catch {
    response.status(500).send("Internal Server Error!");
  }
};

module.exports.registerController = registerController;
