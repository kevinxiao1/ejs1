const express = require('express');
const bycrypt = require('bcrypt');
const app = express();

const users = [];

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}))

// use res.render to load up an ejs view file


// INDEX PAGE
app.get('/', function(req, res) {
  res.render('testing/testing', {
      axios: require('axios')
  });
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