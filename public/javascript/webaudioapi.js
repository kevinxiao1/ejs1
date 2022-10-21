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



const context = new AudioContext()
reverbjs.extend(context);
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

    // var reverbUrl = "http://reverbjs.org/Library/DomesticLivingRoom.m4a";
    // var reverbNode = context.createReverbFromUrl(reverbUrl, function() {
    //     reverbNode.connect(context.destination);
    // });

    context.destination.setSinkId('0ab184bcde00ef60eed49b26566d52ad29e726aa243e67accf8f3bb8be7ba889')


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
            // .connect(reverbNode)
            .connect(context.destination)
    
}

openMic.onclick = () => {
    setupContext();
}

async function addcompress() {
    console.log('compress')
    const compress = document.getElementById('compress')
}

compress.onclick = function() {
    
    if(compress.getAttribute('active') === 'false') {
      compress.setAttribute('active', 'true')
      compress.innerHTML = 'Remove compression'
      compressor.connect(context.destination)
      //reverbNode.connect(compressor).connect(context.destination)
    } else {
      compress.setAttribute('active', 'false')
      compress.innerHTML = 'Add compression'
      context.destination.disconnect(compressor)
    //   reverbNode.disconnect(compressor)
    //   reverbNode.connect(context.destination)
    }
  }

Threshold.oninput = () => {
    compressor.threshold = Threshold.value
}
Knee.oninput = () => {
    compressor.knee = Knee.value
}
Ratio.oninput = () => {
    compressor.ratio = Ratio.value
}
Attack.oninput = () => {
    compressor.attack = parseFloat(Attack.value) 
}
Release.oninput = () => {
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
            btnElement.id = 'reverbToggle'
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
    else if (effectname == '') {
        
    }
    else if (effectname == '') {
        
    }
    else if (effectname == '') {
        
    }
    else if (effectname == '') {
        
    }
}

function reverbToggle() {
    console.log('toggle')
    const list = document.getElementById('reverbList')
    const value = list.options[list.selectedIndex].value

    if (value == 'AbernyteGrainSilo') {
        var reverbUrl = "http://reverbjs.org/Library/AbernyteGrainSilo.m4a";
        var reverbNode = context.createReverbFromUrl(reverbUrl, function() {
            reverbNode.connect(context.destination);
        });
        source.connect(reverbNode)
        console.log('silo')
    }
    else if (value == 'HamiltonMausoleum') {
        var reverbUrl = "http://reverbjs.org/Library/HamiltonMausoleum.m4a";
        var reverbNode = context.createReverbFromUrl(reverbUrl, function() {
            reverbNode.connect(context.destination);
        });
        source.connect(reverbNode)
        console.log('Mausoleum')
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

btnOutList.onclick = async (evt) => {
    // request device access the bad way,
    // until we get a proper mediaDevices.selectAudioOutput
    
}