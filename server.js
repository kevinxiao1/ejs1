if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const bycrypt = require('bcrypt');
const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config')
initializePassport(passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
);

const users = [];

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,
  saveUninitialized : false
}))
app.use(passport.initialize())
app.use(passport.session())

// use res.render to load up an ejs view file


// INDEX PAGE
app.get('/', function(req, res) {
  // res.render('testing/testing', {
  //     axios: require('axios')
  // });
  res.render('pages/index.ejs', {name : req.user.name})
});

// ABOUT PAGE
app.get('/about', function(req, res) {
  res.render('pages/about');
});

// LOGIN PAGE
app.get('/login', function(req, res) {
    res.render('login/login.ejs');
  });

// LOGIN POST
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


// REGISTER PAGE
app.get('/register', function(req, res) {
    res.render('login/register.ejs');
  });
// REGISTER POST
app.post('/register', async(req,res) => {
    try {
        const hashedPassword = await bycrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        res.redirect('/login');
    } catch (error) {
        res.redirect('/register');
    }
    console.log(users);
})


// TESTER LANDING PAGE
app.get('/test', function(req, res) {
    res.render('landing/test', {
    });
  });

  //LANDING PAGE
  app.get('/scenes', function(req, res) {
    res.render('landing/scenes', {
    });
  });
  
  app.get('/mixer', function(req, res) {
    res.render('landing/mixer', {
    });
  });
  app.get('/sdeck', function(req, res) {
    res.render('landing/sdeck', {
    });
  });



app.use(express.json())
// app.use(jsonRouter({ methods: controller }))
app.listen(8080);
console.log('Server is listening on port 8080');