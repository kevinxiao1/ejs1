const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const con = require('./../model/user');


// const users = [];


const initializePassport = require('../passport-config');
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
        var sql = "INSERT INTO user(name, email, password, functions) VALUES('" + name + "', '" + email + "', '" + password + "', 'function')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
        console.log(error)
    }
    console.log(users);
})


function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = router;

