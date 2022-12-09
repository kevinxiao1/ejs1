const e = require("express");

const volume = document.getElementById('volume')
const bass = document.getElementById('bass')
const mid = document.getElementById('mid')
const treble = document.getElementById('treble')
const visualizer = document.getElementById('visualizer');


//trying stuffs
if (!navigator.mediaDevices?.enumerateDevices) {
    console.log("enumerateDevices() not supported.");
  } else {
    // List cameras and microphones.
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        devices.forEach((device) => {
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
      })
      .catch((err) => {
        console.error(`${err.name}: ${err.message}`);
      });
  }


// trying stuffs ends here


//BASIC MIC SETUP AND EQ
const context = new AudioContext()
reverbjs.extend(context);
let panNode = new StereoPannerNode(context)

const analyserNode = new AnalyserNode(context, { fftSize: 256 })
const gainNode = new GainNode(context, {gain: volume.value})
const compressor = new DynamicsCompressorNode(context,
    {threshold:0,knee:0,ratio:12,attack:0.002,release:0.005})

const bassEQ = new BiquadFilterNode(context, {
    type: 'lowshelf',
    frequency: 500,
    gain: bass.value
})
const midEQ = new BiquadFilterNode(context, {
    type: 'peaking',
    Q: Math.SQRT1_2,
    frequency: 1500,
    gain: mid.value
})
const trebleEQ = new BiquadFilterNode(context, {
    type: 'highshelf',
    frequency: 3000,
    gain: treble.value
})

//STEREO PANNING

function pannerchange() {
    const panControl = document.getElementById("panning_control");
    const panValue = document.getElementById("panning_value");
    panNode.pan.value = panControl.value;
    panValue.textContent = panControl.value;
}

// panControl.oninput = () => {
    
// };


//DISTORTION
const dist = context.createWaveShaper();
const distControl = document.getElementById("dist_control")
const distValue = document.getElementById("dist_value")
const DEG = Math.PI / 180;

function makeDistortionCurve(k) {
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  curve.forEach((_, i) => {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * DEG) / (Math.PI + k * Math.abs(x));
  });
  return curve;
}
dist.curve = makeDistortionCurve(0)
distControl.oninput = () => {
    dist.curve = makeDistortionCurve(distControl.value)
    distValue.textContent = distControl.value
}

function toggleDelay() {
    
    
}


    // var reverbUrl = "http://reverbjs.org/Library/DomesticLivingRoom.m4a";
    // var reverbNode = context.createReverbFromUrl(reverbUrl, function() {
    //     reverbNode.connect(context.destination);
    // });

    // context.destination.setSinkId('0ab184bcde00ef60eed49b26566d52ad29e726aa243e67accf8f3bb8be7ba889')

// PLAY FROM FILE
function readFile(files) {
    var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = function(e) {
            playAudioFile(e.target.result);
            console.log(("Filename: '" + files[0].name + "'"), ( "(" + ((Math.floor(files[0].size/1024/1024*100))/100) + " MB)" ));
        }
}
function playAudioFile(file) {
    //var context = new window.AudioContext();
        context.decodeAudioData(file, function(buffer) {
                source = context.createBufferSource();
                source.buffer = buffer;
                source.loop = false;
                source.connect(context.destination);
                source.start(0); 

            var btnplay = document.createElement('button');
            var btnstop = document.createElement('button');
            var parent = document.getElementById('fileplayer')

            btnplay.textContent = "pause"
            btnstop.textContent = "stop"

            btnplay.onclick = () => {
                if (context.state === "running") {
                    context.suspend().then(() => {
                    btnplay.textContent = "play";
                  });
                } else if (context.state === "suspended") {
                    context.resume().then(() => {
                    btnplay.textContent = "pause";
                  });
                }
              };
              btnstop.onclick = () => {
                context.close()
                btnplay.textContent = "play";
              }
              parent.appendChild(btnplay)
              parent.appendChild(btnstop)
        });
}


setupEventListeners();

function setupEventListeners() {

    volume.addEventListener('input', e =>{
        const value = parseFloat(e.target.value);
        gainNode.gain.setTargetAtTime(value, context.currentTime, .01)   
    })

    bass.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        bassEQ.gain.setTargetAtTime(value, context.currentTime, .01)
    })
    mid.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        midEQ.gain.setTargetAtTime(value, context.currentTime, .01)
    })
    treble.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        trebleEQ.gain.setTargetAtTime(value, context.currentTime, .01)
    })

}


function getMic(){
    return navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: false,
            autoGainControl: false,
            noiseSuppresion:false,
            latency: 0
        }
    })
}
var source;
async function setupContext(){
    console.log('getting mic')
    const mic = await getMic()
        await context.resume()


        source = context.createMediaStreamSource(mic)
        source
            .connect(bassEQ)
            .connect(midEQ)
            .connect(trebleEQ)
            .connect(gainNode)
            .connect(analyserNode)
            .connect(panNode)
            .connect(dist)
            // .connect(delay)
            // .connect(reverbNode)
            .connect(context.destination)
    
}

openMic.onclick = () => {
    setupContext();
}

function addcompress() {
    
    const compress = document.getElementById('compress')

    if(compress.textContent == 'Add compression') {
        console.log('compress added')
        compress.setAttribute('active', 'true')
        compress.innerHTML = 'Remove compression'
        // compressor.connect(context.destination)

        source.connect(compressor);
        compressor.connect(context.destination);
        //reverbNode.connect(compressor).connect(context.destination)
      } else {
        compress.setAttribute('active', 'false')
        console.log('compress removedF')
        compress.innerHTML = 'Add compression'
        // source.disconnect(compressor);
        compressor.disconnect(context.destination);
        source.connect(context.destination);
        
      //   reverbNode.disconnect(compressor)
      //   reverbNode.connect(context.destination)
      }
}

// compress.onclick = function() {
    
//     if(compress.getAttribute('active') === 'false') {
//       compress.setAttribute('active', 'true')
//       compress.innerHTML = 'Remove compression'
//       compressor.connect(context.destination)
//       //reverbNode.connect(compressor).connect(context.destination)
//     } else {
//       compress.setAttribute('active', 'false')
//       compress.innerHTML = 'Add compression'
//       context.destination.disconnect(compressor)
//     //   reverbNode.disconnect(compressor)
//     //   reverbNode.connect(context.destination)
//     }
//   }

const Threshold = document.getElementById('Threshold')
const Knee = document.getElementById('Knee')
const Ratio = document.getElementById('Ratio')
const Attack = document.getElementById('Attack')
const Release = document.getElementById('Release')

Threshold.oninput = () => {
    console.log("T")
    compressor.threshold = Threshold.value
}
Knee.oninput = () => {
    console.log("T")
    compressor.knee = Knee.value
}
Ratio.oninput = () => {
    console.log("T")
    compressor.ratio = Ratio.value
}
Attack.oninput = () => {
    console.log("T")
    compressor.attack = parseFloat(Attack.value) 
}
Release.oninput = () => {
    console.log("T")
    compressor.release = parseFloat(Release.value)
}

function addeffect() {
    const effect = document.getElementById('effect_list')
    const parent = document.createElement('div')
    const mixerPad = document.getElementById('mixerPad')

    const effectname = effect.options[effect.selectedIndex].value
    if (effectname == 'reverb') {
        console.log('addreverb')
        try {
            const selectdiv = document.createElement('div')
            const btndiv = document.createElement('div')

            const btnElement = document.createElement('button')
            btnElement.textContent = 'Turn on'
            btnElement.id = 'btnReverbToggle'
            btnElement.setAttribute('onclick', 'reverbToggle()')
            

            const form = document.createElement('form')        
            const select = document.createElement('select')
            select.setAttribute('id', 'reverbList')
            select.classList.add('browser-default')

            const option1 = document.createElement('option')
            const option2 = document.createElement('option')
            option1.textContent = 'AbernyteGrainSilo'
            option1.value = 'AbernyteGrainSilo'
            option2.textContent = 'HamiltonMausoleum'
            option2.value = 'HamiltonMausoleum'

            parent.appendChild(form)
            form.appendChild(select)
            select.appendChild(option1)
            select.appendChild(option2)
            parent.appendChild(btnElement)

            mixerPad.appendChild(parent)
            // mixerPad.appendChild(test)
            console.log('addreverbcomplete')
        } catch (error) {
            console.log(error)
        }
    }
    else if (effectname == 'stereo panner') {
        // <h2>Set stereo panning</h2>
        //     <input
        //         id="panning_control"
        //         type="range"
        //         min="-1"
        //         max="1"
        //         step="0.1"
        //         value="0"
        //     />
        //     <span class="panning_value">0</span>
        try {
            const container = document.createElement('div')
            container.classList.add("row")
            const spandiv = document.createElement('div')
            spandiv.classList.add("col", "s2")
            const spandiv2 = document.createElement('div')
            spandiv2.classList.add("col", "s2")
            const inputdiv = document.createElement('div')
            inputdiv.classList.add("col", "s8")
            const header = document.createElement('h2')
            const span = document.createElement('span')
            span.textContent = '0'
            span.setAttribute('id', 'panning_value')
            header.textContent = 'Stereo Panner'

            const spanleft = document.createElement('span')
            spanleft.textContent = 'left'
            const spanright = document.createElement('span')
            spanright.textContent = 'right'
            const input = document.createElement('input')
            setAttributes(input, {
                "id" :"panning_control",
                "type" :"range",
                "min" :"-1",
                "max" :"1",
                "step" :"0.1",
                "value" :"0",
                "oninput" : "pannerchange()"
            })
 
            container.appendChild(spandiv)
            spandiv.appendChild(spanleft)
            container.appendChild(inputdiv)
            inputdiv.appendChild(input)
            container.appendChild(spandiv2)
            spandiv2.appendChild(spanright)

            parent.appendChild(header)
            parent.appendChild(container)
            parent.appendChild(span)
            mixerPad.appendChild(parent)

            panNode.connect(context.destination)
            source.connect(panNode)

            console.log('pannercomplete')
        } catch (error) {
            console.log(error)
        }
        
    }
    else if (effectname == 'distortion') {
        try {
            const header = document.createElement('h2')
            
            header.textContent = 'Distort'

            const input = document.createElement('input')
            setAttributes(input, {
                "id" :"dist_control",
                "type" :"range",
                "min" :"0",
                "max" :"100",
                "step" :"1",
                "value" :"0",
            })
            
            parent.appendChild(header)
            parent.appendChild(input)
            mixerPad.appendChild(parent)
            console.log('distcomplete')
        } catch (error) {
            console.log(error)
        }
    }
    else if (effectname == 'delay') {
        try {
            const header = document.createElement('h2')
            header.textContent = 'delay'


            parent.appendChild(header)
            mixerPad.appendChild(parent)
            console.log('pannercomplete')
        } catch (error) {
            console.log(error)
        }
    }
    else if (effectname == '') {
        
    }
}

function reverbToggle() {
    console.log('toggle')
    const list = document.getElementById('reverbList')
    const value = list.options[list.selectedIndex].value
    const btn = document.getElementById('btnReverbToggle')
    var reverbNode;

    if (btn.textContent == "Turn on") {
        if (value == 'AbernyteGrainSilo') {
            var reverbUrl = "http://reverbjs.org/Library/AbernyteGrainSilo.m4a";
            reverbNode = context.createSourceFromUrl(reverbUrl, function() {
                reverbNode.connect(context.destination);
            });
            source.connect(reverbNode)
            console.log('silo')
        }
        else if (value == 'HamiltonMausoleum') {
            var reverbUrl = "http://reverbjs.org/Library/HamiltonMausoleum.m4a";
            reverbNode = context.createSourceFromUrl(reverbUrl, function() {
                reverbNode.connect(context.destination);
            });
            source.connect(reverbNode)
            console.log('Mausoleum')
        }
        btn.textContent = "Turn off"
    }
    else {
        
        source.disconnect(context.destination)
        //source.resume()
        btn.textContent = "Turn on"
    }
    
}


// Testing audio output
async function btnOutList(evt) {
    
    (await navigator.mediaDevices.getUserMedia({audio:true}))
        .getTracks().forEach(track => track.stop());
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audio_outputs = devices.filter( (device) => device.kind === "audiooutput" );
    const btn = document.getElementById('btnOutList')
    const pad = document.getElementById('mixerPad')
    const sel = document.createElement("select");
    sel.classList.add('browser-default')
    audio_outputs.forEach( (device, i) => sel.append(new Option( device.label || `device ${i}`, device.deviceId )) );
    pad.appendChild(sel)
    
    btn.textContent = "play audio in selected output";
    btn.onclick = (evt) => {
      const aud = new Audio("https://upload.wikimedia.org/wikipedia/en/d/dc/Strawberry_Fields_Forever_%28Beatles_song_-_sample%29.ogg");
      aud.setSinkId(sel.value);
      aud.play();
    };
}

//DELAY
var delay = context.createDelay();
delay.delayTime.value = 0.4;

const feedback = context.createGain();
feedback.gain.value = 0.3;

const delayControl = document.getElementById('delay_control')
const feedbackControl = document.getElementById('feedback_control')

delayControl.oninput = () => {
    delay.delayTime.value = delayControl.value
}

feedbackControl.oninput = () => {
    feedback.gain.value = feedbackControl.value
}

btnDelay.onclick = () => {
    try {
        console.log('delay')
        const btnDelay = document.getElementById('btnDelay')
        // if (btnDelay.innerHTML == 'activate delay') {
        //     source.connect(delay)
        //     btnDelay.innerHTML == 'deactivate delay'
        // }
        // else{
        //     source.disconnect(delay)
        //     btnDelay.innerHTML == 'activate delay'
        // }
        delay.connect(feedback)
        feedback.connect(delay)
        source.connect(delay)

    } catch (error) {
        console.log(error)
    }
}

btnOutList.onclick = async (evt) => {
    // request device access the bad way,
    // until we get a proper mediaDevices.selectAudioOutput
    
}

// Helper Functions
function setAttributes(el, attrs) {
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }


//DATABASE

