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

// const options = {
//   definition: {
//     // openapi: '3.0.0',
//     info: {
//       title: 'Well Hello There',
//       version: '1.0.0',
//     },
//   },
//   apis: ['./routes/*.js'],
// };
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerSpec = swaggerJSDoc(options);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const tokenHandler = require('./tokenAuth/token');
var router = express.Router();
const evokeRoutes = require("./routes/upload.route");
const evokeEventRoutes = require("./routes/event.types.route");
const evokeCategoriesRoutes = require('./routes/categories.route');
const evokeLoginRoutes = require('./routes/login.route');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// router.use(tokenHandler.tokenMiddleware)

evokeRoutes(app);

evokeEventRoutes(app);

evokeCategoriesRoutes(app);

evokeLoginRoutes(app)

// router.use((request, response, next) => {
//   token = request.headers.authorization
//   console.log(token)
//   jwt.verify(token, b1, function(err, decoded) {
//     if(err){
//       throw err
//     }
//     else{
//       console.log(decoded)
//       console.log("middleware");
//       next();
//     }
//   });
// });

var port = process.env.PORT || 8090;
app.listen(port);
console.log("Event API is runnning at " + port);
