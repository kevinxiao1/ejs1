const express = require('express');
const router = express.Router();
const userRouter = require('./login')
const con = require('./../model/user');

router.route('/deck')
.get((req, res) => {
    
    res.render('landing/deck.ejs')

})
.post(async (req, res) => {
    // var test = req.body.tvalue;
    // console.log(test)

    // var sql = "SELECT * FROM `user`";

    // con.query(sql, function (err, result, fields) {
    //     if (err) throw err;
    //     console.log("read");
    // })

    var name = req.body.sname
    var type = req.body.stype
    console.log(req.user.email)
    console.log("i chose " + name)
    console.log("type is " + type)
    var sql = "SELECT * FROM `user_btn` WHERE email ='" + req.user.email + "'"
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log("read btn list");
        result.forEach(row => {
            if (row.btn_type == null || row.btn_type == "") {
                sql = "UPDATE user_btn SET btn_type= '" + type + "', btn_name='" + name +  "', btn_scrname ='" + name + "' WHERE position=" + row.position +""

                con.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    console.log("button saved!")
                })
            }
        });
    })
})

module.exports = router;
