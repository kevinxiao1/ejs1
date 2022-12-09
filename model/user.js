var mysql= require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'livebuddy'
  });

function checkConnection() {
    if (connection.state === 'disconnected') {
        connection.connect()
    }
}
//    try {
//     connection.connect();
//     console.log('connected')
//    } catch (error) {
//        console.log(error)
//    }

//    try {
//     connection.query({
//         sql: 'SELECT * FROM `user`',
//         timeout: 40000, // 40s
//       },
//       function (error, results, fields) {
//         // error will be an Error if one occurred during the query
//         // results will contain the results of the query
//         // fields will contain information about the returned results fields (if any)
//         console.log(results)
//       }
//     );
//     connection.end()
//    } catch (error) {
//        console.log(error)
//    }
   //module.exports = connection;
   exports.connection = connection;
   exports.checkConnection = checkConnection;