const { getDB } = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginController = async (request, response) => {
  const db = getDB();
  const { username, password } = request.body;
  const getUserQuery = `
    SELECT * FROM user WHERE username = ?
  `;
  try {
    const dbUser = await db.get(getUserQuery, [username]);
    if (dbUser) {
      const isPasswordTrue = await bcrypt.compare(password, dbUser.password);
      if (isPasswordTrue) {
        const payload = {
          userId: dbUser.id,
          username,
          name: dbUser.name,
          gender: dbUser.gender,
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Username or password is incorrect");
      }
    } else {
      response.status(400);
      response.send("Username or password is incorrect");
    }
  } catch {
    response.status(500).send("Internal Server Error!");
  }
};

module.exports.loginController = loginController;
