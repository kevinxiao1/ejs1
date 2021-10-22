var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


// use res.render to load up an ejs view file



// index page
app.get('/', function(req, res) {
    
  res.render('testing/testing', {
      axios: require('axios')
      
  });
  res.header("Access-Control-Allow-Origin","*")
});

// about page
app.get('/about', function(req, res) {
  res.render('pages/about');
});

app.listen(8080);
console.log('Server is listening on port 8080');