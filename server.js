var express = require('express');

var app = express();
// const jsonRouter = require('express-json-rpc-router')
// const OBSWebSocket = require('obs-websocket-js')


// // WEBSOCKET TEST CONNECT
// const obs = new OBSWebSocket();
// obs.connect({
//     address: 'localhost:4444',
//     password: 'kw912049'
// })
// .then(() => {
//     console.log(`Success! We're connected & authenticated.`);

//     return obs.send('GetSceneList');
// })
// .then(data => {
//     console.log(`${data.scenes.length} Available Scenes!`);

//     data.scenes.forEach(scene => {
//         if (scene.name !== data.currentScene) {
//             console.log(`Found a different scene! Switching to Scene: ${scene.name}`);

//             obs.send('SetCurrentScene', {
//                 'scene-name': scene.name
//             });
//         }
//     });
// })
// .catch(err => { // Promise convention dicates you have a catch on every chain.
//     console.log(err);
// });

// obs.on('SwitchScenes', data => {
// console.log(`New Active Scene: ${data.sceneName}`);
// });

// // You must add this handler to avoid uncaught exceptions.
// obs.on('error', err => {
// console.error('socket error:', err);
// });

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// use res.render to load up an ejs view file


// INDEX PAGE
app.get('/', function(req, res) {
  res.render('testing/testing', {
      axios: require('axios')
  });
  res.header("Access-Control-Allow-Origin","*")
});

// ABOUT PAGE
app.get('/about', function(req, res) {
  res.render('pages/about');
});

// LOGIN PAGE
app.get('/login', function(req, res) {
    res.render('login/login');
  });

// TESTER LANDING PAGE
app.get('/test', function(req, res) {
    res.render('landing/test', {
    });
  });


app.use(express.json())
// app.use(jsonRouter({ methods: controller }))
app.listen(8080);
console.log('Server is listening on port 8080');