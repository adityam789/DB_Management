var mysql = require("mysql");
const errorHandling = require("../ErrorHandling/errorHandling");
var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "shubham1",
  database: process.env.DB_NAME || "Events",
});

// Each are for creation of tables
const query1 = `CREATE TABLE IF NOT EXISTS guests (guestid INT NOT NULL PRIMARY KEY, datecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, usercreated VARCHAR(255) NOT NULL, datemodified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, usermodified VARCHAR(255) NOT NULL,  firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, about VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, organization VARCHAR(255) NOT NULL,  timezone VARCHAR(255) NOT NULL);`;

const query2 = `CREATE TABLE IF NOT EXISTS Stages ( StageID int NOT NULL PRIMARY KEY,  DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UserCreated varchar(255) NOT NULL, datemodified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UserModified varchar(255) NOT NULL, Name varchar(255) NOT NULL,Date date NOT NULL,  Time time NOT NULL,DurationHours int NOT NULL, DurationMinutes int NOT NULL,Description varchar(255) NOT NULL);`;

const query3 = `CREATE TABLE IF NOT EXISTS schedule (scheduleid INT NOT NULL PRIMARY KEY, datecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, usercreated VARCHAR(255) NOT NULL, datemodified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, usermodified VARCHAR(255) NOT NULL, stage INT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, starttime TIME NOT NULL, endtime TIME NOT NULL, reportingtime TIME NOT NULL, FOREIGN KEY (stage) REFERENCES stages(stageid));`;

const query4 = `CREATE TABLE IF NOT EXISTS ArtistSchedule ( ID int NOT NULL AUTO_INCREMENT PRIMARY KEY, DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UserCreated varchar(255) NOT NULL, DateModified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UserModified varchar(255) NOT NULL, ScheduleID int NOT NULL, ArtistID int NOT NULL, FOREIGN KEY (ScheduleID) REFERENCES Schedule(ScheduleID), FOREIGN KEY (ArtistID) REFERENCES Guests(GuestID));`;

pool.query(query1, function (error, results, fields) {
  if (error) throw error;
});
pool.query(query2, function (error, results, fields) {
  if (error) throw error;
});
pool.query(query3, function (error, results, fields) {
  if (error) throw error;
});
pool.query(query4, function (error, results, fields) {
  if (error) throw error;
});

const insertIntoGuests = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    const insertQuery =
      `INSERT INTO Guests(GuestID,UserCreated,UserModified,` +
      `FirstName,LastName,Email,About,Role,Organization,TimeZone) VALUE(?,"Me","Me",?,?,?,?,?,?,?)`;
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(
        insertQuery,
        [
          i + 1,
          rows[i].FirstName,
          rows[i].LastName,
          rows[i].Email,
          rows[i].About,
          rows[i].Role,
          rows[i].Organization,
          rows[i].TimeZone,
        ],
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          // Don't use the connection here, it has been returned to the pool.
        }
      );
    });
  }
};

// TODO: Gotta fix the time and date format
const insertIntoStages = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    const insertQuery =
      `INSERT INTO Stages(StageID,UserCreated,UserModified,` +
      `Name,Date,Time,DurationHours,DurationMinutes,Description) VALUE(?,"Me","Me",?,?,?,?,?,?)`;
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!

      // Use the connection
      connection.query(
        insertQuery,
        [
          i + 1,
          rows[i].Name,
          rows[i].Date,
          rows[i].Time,
          rows[i].DurationHours,
          rows[i].DurationMinutes,
          rows[i].Description,
        ],
        function (error, results, fields) {
          // When done with the connection, release it.
          connection.release();

          // Handle error after the release.
          if (error) throw error;

          // Don't use the connection here, it has been returned to the pool.
        }
      );
    });
  }
};

// TODO: if Stage in schedule is incorrect/ stageID of that doesnt exist
// TODO: Fix Time Format in schema and input
const insertIntoSchedule = (rows) => {
  for (let i = 0; i < rows.length; i++) {
    let stageId = -1;
    function fetch(callBack) {
      pool.query(
        "SELECT StageID from Stages where Name = ?",
        [rows[i].Stage],
        function (error, results, fields) {
          if (error) throw error;
          if (results.length == 0) throw error;
          stageId = results[0].StageID;
          callBack(stageId);
        }
      );
    }
    fetch(function (stageId) {
      const insertQuery =
        `INSERT INTO Schedule(ScheduleID,UserCreated,UserModified,` +
        `Stage,Name,Description,StartTime,EndTime,ReportingTime) VALUE(?,"Me","Me",?,?,?,?,?,?)`;
      pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!

        // Use the connection
        connection.query(
          insertQuery,
          [
            i + 1,
            stageId,
            rows[i].Name,
            rows[i].Description,
            rows[i].StartTime,
            rows[i].EndTime,
            rows[i].ReportingTime,
          ],
          function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();

            // Handle error after the release.
            if (error) throw error;

            // Don't use the connection here, it has been returned to the pool.
          }
        );
      });
    });
  }
  return new errorHandling.Success("Completed");
};

// TODO: if artist in ArtistSchedule is incorrect/ GuestID of that doesnt exist
const insertIntoArtistSchedule = (rows) => {
  let k = 0;
  for (let i = 0; i < rows.length; i++) {
    let values = Object.values(rows[i]);
    for (let j = 6; j < values.length; j++) {
      let fn = values[j].split(" ");
      let guestId = -1;
      k += 1;
      function fetch(callBack) {
        pool.query(
          "SELECT GuestID from Guests where FirstName = ? and LastName = ?",
          [fn[0], fn[1]],
          function (error, results, fields) {
            if (error) throw error;
            // here!!
            if (results.length == 0) {
              console.log("No Match Found");
            } else {
              guestId = results[0].GuestID;
              callBack(guestId);
            }
          }
        );
      }
      fetch(function (guestId) {
        const insertQuery = `INSERT INTO ArtistSchedule(UserCreated,UserModified,ScheduleID,ArtistID) VALUE("Me","Me",?,?)`;

        pool.getConnection(function (err, connection) {
          if (err) throw err; // not connected!

          // Use the connection
          connection.query(
            insertQuery,
            [i + 1, guestId],
            function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();

              // Handle error after the release.
              if (error) throw error;

              // Don't use the connection here, it has been returned to the pool.
            }
          );
        });
      });
    }
  }
};

// TODO: what/ how to handle this error
const insertIntoTable = (table) => {
  switch (table) {
    case "Guests":
      return insertIntoGuests;
    case "Stages":
      return insertIntoStages;
    case "Schedule":
      return insertIntoSchedule;
    case "ArtistSchedule":
      return insertIntoArtistSchedule;
    default:
      return console.log(table);
  }
};

module.exports = { pool, insertIntoTable };
