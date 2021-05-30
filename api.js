const readline = require("readline");
const fs = require("fs");
// const pool = require("./sqlConnection");
const readInterface = readline.createInterface({
  input: fs.createReadStream("./DataFiles/eventtypes.txt"),
  // output: process.stdout,
  console: false,
});

// To add eventTypes into the database from .txt file
// readInterface.on('line', function(line) {
//    db.models.Events.create({EventTypeName: line.slice(0, line.length - 1)});
// });

global.__basedir = __dirname; 

var express = require("express");
var cors = require("cors");
var app = express();
var router = express.Router();
const evokeRoutes = require("./routes/upload.route");
const evokeEventRoutes = require("./routes/event.types.route");
const evokeCategoriesRoutes = require('./routes/categories.route');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", router);

evokeRoutes(app);

evokeEventRoutes(app);

evokeCategoriesRoutes(app);

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

var port = process.env.PORT || 8090;
app.listen(port);
console.log("Event API is runnning at " + port);

// Handle error
// app.use((req, res, next) => {
//    setImmediate(() => {
//      next(new Error('Error occured'));
//    });
//  });
 
//  app.use(function (err, req, res, next) {
//    console.error(err.message);
//    if (!err.statusCode) err.statusCode = 500;
//    res.status(err.statusCode).send(err.message);
//  });
