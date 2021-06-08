var mysql = require("mysql");
const tokenHandler = require('../tokenAuth/token');
const token = tokenHandler.token

var pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "shubham1",
  database: process.env.DB_NAME || "Events",
});

const query1 = `CREATE TABLE IF NOT EXISTS Login (adminid INT NOT NULL PRIMARY KEY AUTO_INCREMENT, datecreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP, usercreated VARCHAR(255) NOT NULL, datemodified TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, usermodified VARCHAR(255) NOT NULL,  firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, username VARCHAR(255) NOT NULL UNIQUE, role VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL);`;

pool.query(query1, function (error, results, fields) {
    if (error) throw error;
});

const insertUser = (request, response) => {
    const insertQuery =
      `INSERT INTO Login(UserCreated,UserModified,` +
      `FirstName,LastName,Email,username,Role,password) VALUE("Me","Me",?,?,?,?,?,?)`;
    pool.getConnection(function (err, connection) {
        if (err) throw err; // not connected!
        connection.query(insertQuery,[request.body.firstname,request.body.lastname,request.body.email
            ,request.body.username, request.body.role,request.body.password], function (error, results, fields) {
            // When done with the connection, release it.
            connection.release();
  
            // Handle error after the release.
            if (error) throw error;
  
            // Don't use the connection here, it has been returned to the pool.
            response.json(results)
        })
    })
}

const verifyUser = (request, response) => {
    const searchQuery = "SELECT adminid from Login where username = ? and password = ?"
    pool.query(searchQuery,[request.body.username, request.body.password],function (error, results, fields) {
        if (err) throw err;
        if(results.length > 0){
            response.json({
                verified: true,
                token: token
            })
        }
        else{
            response.json({
                verified: false,
            })
        }
    })
}

module.exports = {insertUser, verifyUser}


