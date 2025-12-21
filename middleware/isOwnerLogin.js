const jwt = require("jsonwebtoken");
const ownerModel = require("../models/owner-model");
module.exports = isOwnerLogin = async (req, res, next) => {
  try {
    if (req.cookies.admin_token === "" || !req.cookies.admin_token)
      return res.redirect("/owners/ownerLogin");

    const decoded = jwt.verify(req.cookies.admin_token, process.env.JWT_KEY);
    if (!decoded) return res.redirect("/owners/ownerLogin");

    const owner = await ownerModel
      .findOne({ email: decoded.email })
      .select("-password");
    req.owner = owner;
    next();
  } catch (err) {
    res.clearCookie("admin_token");
    res.redirect("/owners/ownerLogin");
  }
};
