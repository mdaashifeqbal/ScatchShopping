const jwt = require("jsonwebtoken");
const usrModel = require("../models/user-model");

module.exports = isLoggedIn = async (req, res, next) => {
  if (req.cookies.user_token === "" || !req.cookies.user_token) {
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(req.cookies.user_token, process.env.JWT_KEY);
    let user = await usrModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("user_token");
    res.redirect("/");
  }
};
