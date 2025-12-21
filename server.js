const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const databaseConnect = require("./config/mongoose-connect");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const indexRoute = require("./routes/index");
const userRouter = require("./routes/usersRoutes");
const ownerRouter = require("./routes/ownersRoutes");
const productsRouter = require("./routes/productsRoutes");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.use("/", indexRoute);
app.use("/users", userRouter);
app.use("/owners", ownerRouter);
app.use("/products", productsRouter);

app.listen(PORT);
