const process = require('process')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log('Now the value for FOO is:', process.env.FOO);

const express = require('express');

const app = express();
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const con = require('./model/user')

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
    secret : process.env["SESSION_SECRET"],
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

// WEBTEMPLATE TEST
app.get('/index', (req, res) => {
    res.render('landing/index')
})

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

app.get('/deck', checkAuthenticated , (req,res) => {
    res.render('landing/deck.ejs')
})

// ADMIN PAGE
app.get('/admin/dashboard', (req, res) => {
    // res.render('testing/testing', {
    //     axios: require('axios')
    // });
    res.render('admin/dashboard')
  });
app.get('/admin/tables', (req, res) => {
    // res.render('testing/testing', {
    //     axios: require('axios')
    // });
    res.render('admin/tables')
  });


// INDEX PAGE
app.get('/', checkAuthenticated, (req, res) => {
  // res.render('testing/testing', {
  //     axios: require('axios')
  // });
  //res.render('pages/index.ejs', {name : req.user.name})
    try {
        var sql = "SELECT * FROM `user_btn` WHERE email ='" + req.user.email + "'"
        con.connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            var data = result
            console.log('get data')
            res.render('landing/deck', {
                email : req.user.email,
                data : data
            })
        })
    } catch (error) {
        
    }
    // res.render('landing/deck')

  //res.render('admin/dashboard', {name : req.user.name})
//   req.session.views = (req.session.views + 'views')
//   res.end(req.session.views + 'views')
});



// app.get('/test', (req, res) => {
//     // res.render('testing/testing', {
//     //     axios: require('axios')
//     // });
//     res.render('testing/dragreplace.ejs')
//   });

// ABOUT PAGE
// app.get('/about', function(req, res) {
//   res.render('pages/about');
// });


// TESTER LANDING PAGE
// app.get('/musicplayer', function(req, res) {
//     res.render('testing/musicplayer.ejs', {
//     });
//   });

// app.get('/test', function(req, res) {
//     res.render('landing/test', {
//     });
//   });

  //LANDING PAGE
//   app.get('/proto1', function(req, res) {
//     res.render('landing/proto1', {
//     });
//   });
  
//   app.get('/mixer', function(req, res) {
//     res.render('landing/mixer', {
//     });
//   });
//   app.get('/sdeck', function(req, res) {
//     res.render('landing/sdeck', {
//     });
//   });


app.use(express.json())
// app.use(jsonRouter({ methods: controller }))

// ROUTERS
const userRouter = require('./routes/login')
const deckRouter = require('./routes/deck')
const adminRouter = require('./routes/admin')
app.use(userRouter)
app.use(deckRouter)
app.use(adminRouter)

app.listen(8080);
console.log('Server is listening on port 8080');

// RTMP SERVER

const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

var nms = new NodeMediaServer(config)
nms.run();