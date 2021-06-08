const express = require("express");
const router = express.Router();

const controller = require('../controller/loginController');

let routes = (app) => {

  router.post("/register", controller.insertUser)

  router.post("/verify", controller.verifyUser)

  app.use("/login", router);
};

module.exports = routes;