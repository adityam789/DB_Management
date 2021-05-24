var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'shubham1',
  database        : 'Events'
});

// Each are for creation of tables
const query1 = "CREATE TABLE Guests ("+
    "GuestID int NOT NULL PRIMARY KEY,"+
    "DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"+
    "UserCreated varchar(255) NOT NULL,"+
    "DateModified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"+
    "UserModified varchar(255) NOT NULL,"+
    "FirstName varchar(255) NOT NULL,"+
    "LastName varchar(255) NOT NULL,"+
    "Email varchar(255) NOT NULL,"+
    "About varchar(255) NOT NULL,"+
    "Role varchar(255) NOT NULL,"+
    "Organization varchar(255) NOT NULL,"+
    "TimeZone varchar(255) NOT NULL);"

const query2 = "CREATE TABLE Stages ("+
    "StageID int NOT NULL PRIMARY KEY,"+
    "DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"+
    "UserCreated varchar(255) NOT NULL,"+
    "DateModified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"+
    "UserModified varchar(255) NOT NULL,"+
    "Name varchar(255) NOT NULL,"+
    "Date date NOT NULL,"+
    "Time time NOT NULL,"+
    "DurationHours int NOT NULL,"+
    "DurationMinutes int NOT NULL,"+
    "Description varchar(255) NOT NULL);"

const query3 = "CREATE TABLE Schedule ("+
    "ScheduleID int NOT NULL PRIMARY KEY,"+
    "DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"+
    "UserCreated varchar(255) NOT NULL,"+
    "DateModified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"+
    "UserModified varchar(255) NOT NULL,"+
    "Stage int FOREIGN KEY REFERENCES Stages(StageID),"+
    "Name varchar(255) NOT NULL,"+
    "Description varchar(255) NOT NULL,"+
    "StartTime time NOT NULL,"+
    "EndTime time NOT NULL,"+
    "ReportingTime time NOT NULL);"

const query4 = "CREATE TABLE ArtistSchedule ("+
    "ID int NOT NULL PRIMARY KEY,"+
    "DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,"+
    "UserCreated varchar(255) NOT NULL,"+
    "DateModified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,"+
    "UserModified varchar(255) NOT NULL,"+
    "ScheduleID int FOREIGN KEY REFERENCES Schedule(ScheduleID),"+
    "ArtistID int FOREIGN KEY REFERENCES Guests(GuestID));"+


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
    for(let i = 0; i < rows.length; i++){
        const insertQuery = `INSERT INTO Guests(GuestID,UserCreated,UserModified,`+
            `FirstName,LastName,Email,About,Role,Organization,TimeZone) VALUE(`+
            `${i},"Me","Me",${rows[i].FirstName},${rows[i].LastName},${rows[i].Email},${rows[i].About},${rows[i].Role},${rows[i].Organization},${rows[i].TimeZone})`
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
           
            // Use the connection
            connection.query(insertQuery, function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
           
              // Handle error after the release.
              if (error) throw error;
           
              // Don't use the connection here, it has been returned to the pool.
            });
        });
    }
}

// TODO: Gotta fix the time and date format
const insertIntoStages = (rows) => {
    for(let i = 0; i < rows.length; i++){
        const insertQuery = `INSERT INTO Stages(StageID,UserCreated,UserModified,`+
            `Name,Date,Time,DurationHours,DurationMinutes,Description) VALUE(`+
            `${i},"Me","Me",${rows[i].Name},${rows[i].Date},${rows[i].Time},${rows[i].DurationHours},${rows[i].DurationMinutes},${rows[i].Description})`
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
           
            // Use the connection
            connection.query(insertQuery, function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
           
              // Handle error after the release.
              if (error) throw error;
           
              // Don't use the connection here, it has been returned to the pool.
            });
        });
    }
}

// TODO: if Stage in schedule is incorrect/ stageID of that doesnt exist
// TODO: Fix Time Format in schema and input
const insertIntoSchedule = (rows) => {
    for(let i = 0; i < rows.length; i++){
        let stageId = -1
        pool.query("SELECT StageID from Stages where Name = "+`${rows[i].Stage}`, function (error, results, fields) {
            if (error) throw error;
            if(results.length == 0) throw error;
            stageId = results[0].StageID
        });
        const insertQuery = `INSERT INTO Schedule(ScheduleID,UserCreated,UserModified,`+
            `Stage,Name,Description,StartTime,EndTime,ReportingTime) VALUE(`+
            `${i},"Me","Me",${stageId},${rows[i].Name},${rows[i].Description},${rows[i].StartTime},${rows[i].EndTime},${rows[i].ReportingTime})`
        pool.getConnection(function(err, connection) {
            if (err) throw err; // not connected!
           
            // Use the connection
            connection.query(insertQuery, function (error, results, fields) {
              // When done with the connection, release it.
              connection.release();
           
              // Handle error after the release.
              if (error) throw error;
           
              // Don't use the connection here, it has been returned to the pool.
            });
        });
    }
}

// TODO: if artist in ArtistSchedule is incorrect/ GuestID of that doesnt exist
const insertIntoArtistSchedule = (rows) => {
    let k = 0
    for(let i = 0; i < rows.length; i++){
        let values = Object.values(rows[i])
        for(let j = 6; j < values.length; j++){

            let fn = values[j].split(" ")
            let guestId = -1

            pool.query("SELECT GuestID from Guests where FirstName = "+`${fn[0]}`+" and LastName = "+`${fn[1]}`, function (error, results, fields) {
                if (error) throw error;
                // here!!
                if(results.length == 0) throw error;
                guestId = results[0].GuestID
            });

            const insertQuery = `INSERT INTO ArtistSchedule(ID,UserCreated,UserModified,`+
            `ScheduleID,ArtistID) VALUE(`+
            `${k},"Me","Me",${i},${guestId})`
        
            pool.getConnection(function(err, connection) {
                if (err) throw err; // not connected!
            
                // Use the connection
                connection.query(insertQuery, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();
            
                // Handle error after the release.
                if (error) throw error;
            
                // Don't use the connection here, it has been returned to the pool.
                });
            });

            k += 1
        }
    }
}

// TODO: what/ how to handle this error
const insertIntoTable = (table) => {
    switch(table){
        case "Guests":
            return insertIntoGuests
        case "Stages":
            return insertIntoStages
        case "Schedule":
            return insertIntoSchedule
        case "ArtistSchedule":
            return insertIntoArtistSchedule 
        default:
            return console.log(table)
    }
};

module.exports = {pool, insertIntoTable};