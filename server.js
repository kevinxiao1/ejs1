if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');

const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

// var options = {
// 	host: 'localhost',
// 	port: 3306,
// 	user: 'root',
// 	password: '',
// 	database: 'livebuddy'
// };

// var connection = mysql.createConnection(options); // or mysql.createPool(options);
// var sessionStore = new MySQLStore({}/* session store options */, connection);

// document.cookie = 'sessionViews=0; expires' + new Date(9999, 0 , 1).toUTCString();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.set('trust proxy', 1)
app.use(session({
    key : 'session_cookie_name',
    secret : process.env.SESSION_SECRET,
    // store : sessionStore,
    resave : false,
    saveUninitialized : false,
}))

// var sessionStore = new MySQLStore(options);

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'));
// app.set('trust proxy', 1) // trust first proxy

// app.use(cookieSession({
//     name: 'session',
//     keys: ['key1', 'key2']
// }))

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
  if (req.session.views) {
    req.session.views++
  } else {
    req.session.views = 1
  }
  console.log(req.session);
  //res.render('pages/index.ejs', {name : req.user.name})
  res.render('landing/deck', {name : req.user.name})
//   req.session.views = (req.session.views + 'views')
//   res.end(req.session.views + 'views')
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


app.use(express.json())
// app.use(jsonRouter({ methods: controller }))

// ROUTERS
const userRouter = require('./routes/login')
const deckRouter = require('./routes/deck')
app.use(userRouter)
app.use(deckRouter)

app.listen(8080);
console.log('Server is listening on port 8080');