const dotenv = require("dotenv");
const express = require("express");
const { dbConnection } = require("./db/server");
const errorController = require("./helper/errorController");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const authRouter = require("./auth/auth");
const avatarRouter = require("./router/avatarUpload")
const userRouter = require("./router/user");
const development =require("./router/development");


// Env file configurations
dotenv.config();

// Database connections
dbConnection();

// Define static files
app.use("/public", express.static(path.join(__dirname, "./public")));

// App middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Use router in app
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use(avatarRouter);
// This routers is only used for developers ....
app.use(development);

// Error handling middleware
app.use(errorController);


const port = process.env.PORT || 5051;
app.listen(port, () => console.log(`http://localhost:${port}`));
