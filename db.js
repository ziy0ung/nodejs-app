var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'123',
  database:'db',
  dateStrings: 'date'
});
db.connect();

module.exports = db;