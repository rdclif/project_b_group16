var mysql = require('mysql');
var connection = mysql.createConnection({
  //host            : '$IP',
  host            : '0.0.0.0',
  //user            : '$C9_USER',
  user            : 'cliftonr',   
  password        : '',
  database        : 'c9'
});

module.exports.connection = connection;