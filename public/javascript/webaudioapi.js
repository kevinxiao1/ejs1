const volume = document.getElementById('volume')
const bass = document.getElementById('bass')
const mid = document.getElementById('mid')
const treble = document.getElementById('treble')
const visualizer = document.getElementById('visualizer');




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

    var reverbUrl = "http://reverbjs.org/Library/DomesticLivingRoom.m4a";
    var reverbNode = context.createReverbFromUrl(reverbUrl, function() {
        reverbNode.connect(context.destination);
    });


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
            .connect(reverbNode)
    
}

openMic.onclick = () => {
    setupContext();
}

compress.onclick = function() {
    console.log('test')
    if(compress.getAttribute('active') === 'false') {
      compress.setAttribute('active', 'true')
      compress.innerHTML = 'Remove compression'
      reverbNode.connect(compressor).connect(context.destination)
    } else {
      compress.setAttribute('active', 'false')
      compress.innerHTML = 'Add compression'
      reverbNode.disconnect(compressor)
      reverbNode.connect(context.destination)
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