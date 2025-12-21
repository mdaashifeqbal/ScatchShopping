const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");


const ownerModel = require("../models/owner-model");
const userModel = require("../models/user-model");


//user register first time
module.exports.registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) return res.status(401).send("user already exist login please");
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) return res.send(err.message);
        else {
          const createdUser = await userModel.create({
            fullname,
            email,
            password:hash,
          });
          res.cookie("user_token", generateToken(createdUser));
          res.status(201).json({success:true, message:"user created successfully"});
        }
      });
    });
  } catch (err) {
    console.log(err.message);
  }
};

//register user login
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.send("email or password is incorrect ");

    bcrypt.compare(password, user.password, (err, result) => {
      if (!result)
        return res.status(401).send("email or password is incorrect");

      res.cookie("user_token", generateToken(user));
      res.redirect("/users/shop");
    });
  } catch (err) {
    res.send(err.message);
  }
};

//owner creation route only available on development phase
module.exports.ownerCreate=async (req, res) => {
    const owner = await ownerModel.find();
    if (owner.length > 0) {
      return res.send("you have not admin privilage");
    }

    try {
      const { fullname, email, password } = req.body;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) return res.send(err.message);
          const newOwner = new ownerModel({
            fullname,
            email,
            password: hash,
          });
          await newOwner.save();
          res.send("owner created successfully");
        });
      });
    } catch (err) {
      console.log(err.message);
    }
  };

//owner login route
module.exports.ownerLogin=async (req, res) => {
  const { email, password } = req.body;
  const owner = await ownerModel.findOne({ email });
  if (!owner) return res.status(401).send("email or password is incorrect");

  try {
    bcrypt.compare(password, owner.password, (err, result) => {
      if (err) return res.send(err.message);
      if (!result) return res.send("inavlid credentials");
      res.cookie("admin_token", generateToken(owner));
      res.redirect("/owners/adminPanel");
    });
  } catch (err) {
    res.send(err.message);
  }
};

