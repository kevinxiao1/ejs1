const express = require('express');
const router = express.Router();
const userRouter = require('./login')
const con = require('./../model/user');
const passport = require('passport');
//const connection = require('./../model/user');

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

router.route('/deck', checkNotAuthenticated)
// .get((req, res) => {
//     var sql = "SELECT * FROM `user_btn` WHERE email ='" + req.user.email + "'"
//     var data = "1";
//     try {
//         var sql = "SELECT * FROM `user_btn` WHERE email ='" + req.user.email + "'"
//         con.connection.query(sql, function (err, result, fields) {
//             if (err) throw err;
//             data = result
//             console.log('get data')
//         })
//     } catch (error) {
        
//     }
//     // res.render('landing/deck.ejs', {
//     //     btndata: data,
//     // })

    
// })
.post(async (req, res) => {
    // var test = req.body.tvalue;
    // console.log(test)

    // var sql = "SELECT * FROM `user`";

    // con.query(sql, function (err, result, fields) {
    //     if (err) throw err;
    //     console.log("read");
    // })
    var submit = req.body.submit
    if(submit === "adddeck"){
        var name = req.body.sname
        var type = req.body.stype
        console.log(req.user.email)
        console.log("i chose " + name)
        console.log("type is " + type)
        var sql = "SELECT * FROM `user_btn` WHERE email ='" + req.user.email + "'"


        //con.connection.connect()        


        con.connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log("read btn list");
            var status = 0;

            for (let i= 0; i < result.length; i++) {
                if (result[i].btn_type == null || result[i].btn_type =="") {
                    sql = "UPDATE user_btn SET btn_type= '" + type + "', btn_name='" + name +  "', btn_srcname ='" + name + "' WHERE position=" + result[i].position +""

                    con.connection.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        console.log("button saved!")
                    
                    })
                    
                    break;
                }
            }
            // result.forEach(row => {
            //     if (row.btn_type == null || row.btn_type == "") {

            //         sql = "UPDATE user_btn SET btn_type= '" + type + "', btn_name='" + name +  "', btn_srcname ='" + name + "' WHERE position=" + row.position +""

            //         con.query(sql, function (err, result, fields) {
            //             if (err) throw err;
            //             console.log("button saved!")
            //         })
            //     }
            // });

        })
      } else if(submit === "startstream"){
        var sql = "SELECT * FROM `user_btn` WHERE email ='" + req.user.email + "'"
        con.connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log("startstream");
        })
      }
    
    res.status(204).send();
    //con.connection.end();
})

module.exports = router;
