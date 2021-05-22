const db = require("./eventModel");
const { Op } = require("sequelize");
const readline = require("readline");
const fs = require("fs");
const pool = require("./sqlConnection");
const readInterface = readline.createInterface({
  input: fs.createReadStream("./eventtypes.txt"),
  // output: process.stdout,
  console: false,
});
const readInterfaceCategories = readline.createInterface({
  input: fs.createReadStream("./categories.txt"),
  // output: process.stdout,
  console: false,
});
let ExcelData = require("./excelData");
let CategoriesDate = []

// To add eventTypes into the database from .txt file
// readInterface.on('line', function(line) {
//    db.models.Events.create({EventTypeName: line.slice(0, line.length - 1)});
// });

readInterfaceCategories.on('line', function(line) {
   CategoriesDate.push(line.slice(0, line.length - 1))
});

// Database Connection
(async () => {
  await db.authenticate();
  console.log("Connection has been established successfully.");
})().catch((e) => {
  // Deal with the fact the chain failed
  console.error("Unable to connect to the database:", e);
});
db.sync();

global.__basedir = __dirname; 

var express = require("express");
var cors = require("cors");
var app = express();
var router = express.Router();
const evokeRoutes = require("./routes/upload.route");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/api", router);

evokeRoutes(app);

router.use((request, response, next) => {
  console.log("middleware");
  next();
});

// Fetch All Events
router.get("/events", async (request, response) => {
  var events = await db.models.Events.findAll({
    where: {
      isDeleted: {
        [Op.eq]: 0,
      },
    },
  });
  response.json(events);
});

// Search Events with typeName
router.post("/events/search", async (request, response) => {
  let selectedEvents = await db.models.Events.findAll({
    where: {
      EventTypeName: request.body.name,
      isDeleted: 0,
    },
  });
  response.json(selectedEvents);
});

// Add an eventType
router.route("/events/add").post(async (request, response) => {
  let event = await db.models.Events.create({
    EventTypeName: request.body.name,
  });
  response.json(event);
});

// HardDelete an eventType
router.post("/events/delete", async (request, response) => {
  await db.models.Events.destroy({
    where: {
      EventTypeName: request.body.name,
    },
  });
  response.end();
});

// softDelete an eventType
router.post("/events/softDelete", async (request, response) => {
  await db.models.Events.update(
    { isDeleted: 1 },
    {
      where: {
        EventTypeName: request.body.name,
      },
    }
  );
  response.end();
});

router.post("/events/ExcelData", async (request, response) => {
  for (let i = 0; i < ExcelData.length; ++i) {
    db.models.Events.create({ EventTypeName: ExcelData[i].name });
  }
  response.end();
});

router.post("/events/categoriesData", async (request, response) => {
   for(let i = 0; i < CategoriesDate.length; ++i){
      pool.getConnection(function(err, connection) {
         if (err) throw err; // not connected!
         // Use the connection
         connection.query('INSERT INTO Categories (CategoryName) VALUES (?)',[CategoriesDate[i].slice(0, CategoriesDate[i].length - 1)], function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();    
            // Handle error after the release.
            if (error) throw error;
            // Don't use the connection here, it has been returned to the pool.
         });
      });
   }

   response.end()

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
