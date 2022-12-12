const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const con = require('./../model/user');


// const users = [];


const initializePassport = require('../passport-config');
const connection = require('./../model/user');
initializePassport(passport
//   email => users.find(user => user.email === email),
//   id => users.find(user => user.id === id)
    // email => 
    //     ,
    // id =>
);


// LOGIN PAGE
router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login/login.ejs');
  });

// LOGIN POST
router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))




// REGISTER PAGE
router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('login/register.ejs');
  });
// REGISTER POST
router.post('/register', checkNotAuthenticated, async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const password = hashedPassword;

    try {
        // users.push({
        //     id: Date.now().toString(),
        //     name: name,
        //     email: email,
        //     password: password,
        // })
        con.connection.connect()
        var sql = "SELECT * FROM `user` WHERE `email` = '" + email + "'";
        con.connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log("read");
            if (result.length > 0) {
                console.log(result)
                console.log('email already registered')
                res.redirect('/register');
            }
            else{
                //insert user
                sql = "INSERT INTO user(name, email, password, functions) VALUES('" + name + "', '" + email + "', '" + password + "', 'function')";
                con.connection.query(sql, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                });

                // generate button database
                
                for (let i = 0; i < 12; i++) {
                    var pcount = i + 1;
                    sql = "INSERT INTO user_btn(email, position) VALUES('" + email + "'," + "'" + pcount + "')";
                    con.connection.query(sql, function (err, result) {
                        if (err) throw err;
                        
                    });

                    if (i == 11) {
                        console.log("button generated");
                    }
                }
                //con.connection.end();
                res.redirect('/login');
            }
        });

    } catch (error) {
        //connection.end()
        res.redirect('/register');
        console.log(error)
    }
})


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router;

