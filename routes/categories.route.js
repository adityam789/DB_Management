const express = require("express");
const router = express.Router();

const controller = require('../controller/categories.controller');

let routes = (app) => {

    router.get("/length", controller.getLength)

    router.get("", controller.getCategories)

    router.post("/addAll", controller.insertCategories)

    router.post("", controller.insertCategory)

    router.delete("", controller.deleteCategories)

    router.delete("/hard", controller.hardDeleteCategories)

    app.use("/categories", router);
    
};
  
module.exports = routes;