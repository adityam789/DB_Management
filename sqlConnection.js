var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : 'shubham1',
  database        : 'Events'
});

pool.query('CREATE TABLE IF NOT EXISTS Categories (ID int AUTO_INCREMENT primary key, CategoryName varchar(255), isDeleted int default(0))', function (error, results, fields) {
    if (error) throw error;
});

module.exports = pool;