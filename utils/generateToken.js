const jwt = require("jsonwebtoken");

module.exports.generateToken = (data) => {
  return jwt.sign({ email: data.email, id: data._id }, process.env.JWT_KEY);
};
