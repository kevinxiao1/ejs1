var mysql= require('mysql');
const con = require('../../model/user');

function select(){
    var sql = "SELECT * FROM `user`"

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log("read");

        console.log(result)

        result.forEach(row => {
            console.log(row.user_id)
        });
    })
}

select()