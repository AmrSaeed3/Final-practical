const jwt = require("jsonwebtoken");

require("dotenv").config();
secretKey = process.env.JWT_SECLET_KEY;
const generate = async (payload) => {
  const token = await jwt.sign(payload, secretKey);
  return  token;
};
module.exports = {
  generate,
};
