
//////////////////////////// PIZZICATO FUNCTIONS




  

// for (let index = 0; index < button.length; index++) {
//     var b = button[index]
//     b.addEventListener('click', function(event) {

//         console.log('clicked')
//         var sawtoothWave = new Pizzicato.Sound({ 
//             source: 'wave',
//             options: {
//                 type: 'sawtooth',
//                 volume : 0.01
//             }
//         });
        
//         var delay = new Pizzicato.Effects.Delay();
//         sawtoothWave.addEffect(delay);
        
//         sawtoothWave.play();
//     })
// }



var sawtoothWave = new Pizzicato.Sound({ 
    source: 'wave',
    options: {
        type: 'sawtooth',
        volume : 1
    }
});

function volumechange() {
    var vol = document.getElementById('volume').value
    sawtoothWave.volume = vol / 1000;
}

function test() {
    // var stat = sawtoothWave
    // stat.on('play', function() {
    //     stat.pause();
    //     console.log('paused')
    // })
    // stat.on('pause', function() {
    //     stat.play();
    //     console.log('played')
    // })
    // console.log('clicked')
    // console.log(sawtoothWave)

    var button = document.getElementsByClassName('btn-testplay')[0].value
    console.log(button)

    if (button == 'false') {
        sawtoothWave.play()
        document.getElementsByClassName('btn-testplay')[0].value = 'true'
        console.log(document.getElementsByClassName('btn-testplay')[0].value)
    }
    else{
        sawtoothWave.pause()
        document.getElementsByClassName('btn-testplay')[0].value = 'false'
        console.log(document.getElementsByClassName('btn-testplay')[0].value)
    }
}

function playfile() {
    console.log('tes');
    var file = new Pizzicato.Sound('./audio/yas.mp3', function (params) {
        file.play()
    });
}




//////////////////////////// SLOBS API FUNCTIONS

function slobstoken(){
        
    Axios.post('https://streamlabs.com/api/v1.0/token', {
        params : {
            grant_type : 'authorization_code',
            client_id : '1rnzFihkHYQ7hsOvgveBmxyJYs9vKRaTrmK0rDf4',
            client_secret : 'UG98Y7cXdNB08fHLjFbRdUXjTCxsgYhwafB0kL5j',
            redirect_uri : 'http://localhost:3000/users',
            }
        })
    .then(function (response) {
        // handle success
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
}


// OTHER JAVASCRIPT STUFF
function createButton() {
    var mousePosition;
    var offset = [0,0];
    var div;
    var isDown = false;

    div = document.createElement("button");
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.width = "100px";
    div.style.height = "100px";
    div.style.background = "red";
    div.style.color = "blue";

    document.body.appendChild(div);

    div.addEventListener('mousedown', function(e) {
        isDown = true;
        offset = [
            div.offsetLeft - e.clientX,
            div.offsetTop - e.clientY
        ];
    }, true);

    document.addEventListener('mouseup', function() {
        isDown = false;
    }, true);

    document.addEventListener('mousemove', function(event) {
        event.preventDefault();
        if (isDown) {
            mousePosition = {

                x : event.clientX,
                y : event.clientY

            };
            div.style.left = (mousePosition.x + offset[0]) + 'px';
            div.style.top  = (mousePosition.y + offset[1]) + 'px';
        }
    }, true);
}