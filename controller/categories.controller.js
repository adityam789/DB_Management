const readline = require("readline");
const fs = require("fs");
const pool = require("../sqlConnection");

const readInterfaceCategories = readline.createInterface({
  input: fs.createReadStream("./DataFiles/categories.txt"),
  // output: process.stdout,
  console: false,
});

let CategoriesData = [];

readInterfaceCategories.on("line", function (line) {
  CategoriesData.push(line.slice(0, line.length));
});

const getLength = async (req, res) => {
    pool.getConnection(function(err, connection){
        if (err) throw err;
        connection.query('SELECT COUNT(*) as `cnt` FROM `categories` WHERE `isDeleted` = ?', [0],function(error, results, fields){
            if (error) throw error;
            connection.release();
            res.json(results[0].cnt);
        })
    })
}

const insertCategories = async (req, res) => {
  for (let i = 0; i < CategoriesData.length; ++i) {
    pool.getConnection(function (err, connection) {
      if (err) throw err; // not connected!
      // Use the connection
      connection.query(
        "INSERT INTO Categories (ID, CategoryName) VALUES (?,?)",
        [i+1,CategoriesData[i].slice(0, CategoriesData[i].length)],
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
  res.end();
};

// Fetch All Events
const getCategories = async (request, response) => {
  if (request.query.search) {
    let selectedEvents = [];
    function fetch(callback){
        pool.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query('SELECT * FROM `categories` where `CategoryName` = ? and `isDeleted` = ?',[request.query.search, 0], function (error, results, fields) {
                callback(error, results)          
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                // if (error) throw error;
                // Don't use the connection here, it has been returned to the pool.
            });
        });  
    }
    fetch(function(err, content) {
        if (err) {
            console.log(err);
            response.send(err);  
            // Do something with your error...
        } else {
            selectedEvents = content;
            response.json(selectedEvents);
        }
    });
  }
  else if(request.query.page){
    let pageStart = request.query.page * 20 || 0
    let pageEnd = request.query.page * 20 + 20 || 20
    let selectedEvents = [];
    function fetch(callback){
        pool.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query('SELECT * FROM `categories` where `ID` >= ? AND `ID` <= ? AND `isDeleted` = ?', [pageStart,pageEnd,0],function (error, results, fields) {
                callback(error, results)          
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                // if (error) throw error;
                // Don't use the connection here, it has been returned to the pool.
            });
        });  
    }
    fetch(function(err, content) {
        if (err) {
            console.log(err);
            response.send(err);  
            // Do something with your error...
        } else {
            selectedEvents = content;
            response.json(selectedEvents);
        }
    });
  }
  else{
    let selectedEvents = [];
    function fetch(callback){
        pool.getConnection(function (err, connection) {
            if (err) throw err; // not connected!
            // Use the connection
            connection.query('SELECT * FROM `categories` where `isDeleted` = ?',[0], function (error, results, fields) {
                callback(error, results)          
                // When done with the connection, release it.
                connection.release();
                // Handle error after the release.
                // if (error) throw error;
                // Don't use the connection here, it has been returned to the pool.
            });
        });  
    }
    fetch(function(err, content) {
        if (err) {
            console.log(err);
            response.send(err);  
            // Do something with your error...
        } else {
            selectedEvents = content;
            response.json(selectedEvents);
        }
    });
  }
};

const deleteCategories = async (req, res) => {
    if(!req.query.name && !req.query.id) { console.log("Request Query doesn't have name parameter"); res.send("Request Query doesn't have name parameter"); }
    else if(req.query.name){
        pool.getConnection(function(error, connection) {
            if(error) throw error;
            connection.query('UPDATE `categories` set `isDeleted` = ? where `CategoryName` = ?',[1, req.query.name] ,function (error, results, fields){
                if(error) throw error
                connection.release()
                res.json(results.message)
            })
        })
    }
    else{
        pool.getConnection(function(error, connection) {
            if(error) throw error;
            connection.query('UPDATE `categories` set `isDeleted` = ? where `ID` = ?',[1, req.query.id] ,function (error, results, fields){
                if(error) throw error
                connection.release()
                res.json(results.message)
            })
        })
    }
}

const hardDeleteCategories = async (req, res) => {
    if(!req.query.name) { console.log("Request Query doesn't have name parameter"); res.send("Request Query doesn't have name parameter"); }
    else{
        pool.getConnection(function(error, connection) {
            if(error) throw error;
            connection.query('DELETE from `categories` where `CategoryName` = ?',[req.query.name] ,function (error, results, fields){
                if(error) throw error
                connection.release()
                res.json(results)
            })
        })
    }
}

const update = async (req, res) => {
    if(!req.body.name || !req.body.isDeleted || !req.body.toEdit) { console.log("Request body doesn't have name parameter"); res.send("Request body doesn't have name parameter"); }
    pool.getConnection(function(error, connection) {
        if(error) throw error;
        connection.query('UPDATE `categories` set `isDeleted` = ?, `CategoryName` = ? where `CategoryName` = ?',[req.body.isDeleted, req.body.name, req.body.toEdit] ,function (error, results, fields){
            if(error) throw error
            connection.release()
            res.json(results.message)
        })
    })
}

const insertCategory = async (req, res) => {
    if(!req.query.name) { console.log("Request Query doesn't have name parameter"); res.send("Request Query doesn't have name parameter"); }
    else{
        pool.getConnection(function(error, connection) {
            if(error) throw error;
            connection.query("INSERT INTO Categories (CategoryName) VALUES (?)", [req.query.name],function (error, results, fields){
                if(error) throw error
                connection.release()
                res.json(results)
            })
        })
    }    
}

module.exports = { insertCategories , getCategories, getLength, insertCategory, deleteCategories, hardDeleteCategories, update };
