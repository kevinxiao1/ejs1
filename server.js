if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');

const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');


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
app.use(methodOverride('_method'));

// LOGOUT METHOD
app.delete('/logout', (req,res) => {
    req.logOut()
    res.redirect('/login')
})

// use res.render to load up an ejs view file

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    
    return res.redirect('/login')
}




// INDEX PAGE
app.get('/', checkAuthenticated, (req, res) => {
  // res.render('testing/testing', {
  //     axios: require('axios')
  // });
  res.render('pages/index.ejs', {name : req.user.name})
});

app.get('/test', (req, res) => {
    // res.render('testing/testing', {
    //     axios: require('axios')
    // });
    res.render('testing/dragreplace.ejs')
  });

// ABOUT PAGE
app.get('/about', function(req, res) {
  res.render('pages/about');
});


// TESTER LANDING PAGE
app.get('/test', function(req, res) {
    res.render('landing/test', {
    });
  });

  //LANDING PAGE
  app.get('/proto1', function(req, res) {
    res.render('landing/proto1', {
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

// DATABASE CONNECTION



app.use(express.json())
// app.use(jsonRouter({ methods: controller }))

// ROUTERS
const userRouter = require('./routes/login')
const deckRouter = require('./routes/deck')
app.use(userRouter)
app.use(deckRouter)

app.listen(8080);
console.log('Server is listening on port 8080');