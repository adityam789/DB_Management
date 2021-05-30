var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST || "localhost",
  user            : process.env.DB_USER || "root",
  password        : process.env.DB_PASS || 'shubham1',
  database        : process.env.DB_NAME || 'Events'
});

pool.query('CREATE TABLE IF NOT EXISTS Categories (ID int AUTO_INCREMENT primary key, CategoryName varchar(255), isDeleted int default(0))', function (error, results, fields) {
    if (error) throw error;
});

module.exports = pool;