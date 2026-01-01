const express = require("express");
const { ownerCreate, ownerLogin } = require("../controllers/authControllers");
const { ownerLogout } = require("../controllers/logoutControllers");
const isOwnerLogin = require("../middleware/isOwnerLogin");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("working fine");
});

router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

//owner create route available only when in development phase by setting NODE_ENV="development";

router.post("/create", ownerCreate);

//send to admin login page
router.get("/ownerLogin", (req, res) => {
  res.render("adminLogin");
});
//owner login post request route
router.post("/ownerLogin", ownerLogin);

//admin panel page render request
router.get("/adminPanel", isOwnerLogin, (req, res) => {
  res.render("adminPanel");
});

//owners safely logout
router.get("/logout", ownerLogout);

module.exports = router;
