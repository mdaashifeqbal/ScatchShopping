const express = require("express");
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

const { registerUser, loginUser } = require("../controllers/authControllers");
const { userLogout } = require("../controllers/logoutControllers");

const productsModel = require("../models/product-model");
const userModel = require("../models/user-model");

const router = express.Router();

router.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});


//new user register post route
router.post("/register", registerUser);

//existing user login route
router.post("/login", loginUser);

//get all products only to login users route
router.get("/shop", isLoggedIn, async (req, res) => {
  const products = await productsModel.find();
  res.render("shop", { products });
});

//add to cart get route api
router.get("/addtocart/:productId", isLoggedIn, async (req, res) => {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .select("-password");
    user.cart.push(req.params.productId);
    await user.save();
    res.redirect("/users/cart");
  } catch (err) {
    res.send(err.message);
  }
});

//show cart route api
router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const userCart = await userModel
      .findOne({ email: req.user.email })
      .select("-password")
      .select("-email")
      .populate("cart");
    res.render("cart", { userCart });
  } catch (err) {
    res.send(err.message);
  }
});

//remove cart items route
router.get("/cart/:productId", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    await userModel.updateOne(
      {_id:userId},
      { $pull: { cart: new mongoose.Types.ObjectId(productId) } }
    );

    res.redirect("/users/cart");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});


//order placed feature comming soon route

router.get("/orderPlaced",isLoggedIn,(req,res)=>{
  res.render("orderPlaced");
})
router.get("/logout", userLogout);

module.exports = router;
