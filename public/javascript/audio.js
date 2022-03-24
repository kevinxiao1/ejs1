

const volume = document.getElementById('volume')
const bass = document.getElementById('bass')
const mid = document.getElementById('mid')
const treble = document.getElementById('treble')
const visualizer = document.getElementById('visualizer');
const reverb = document.getElementById('reverb');
console.log(visualizer.width)


const context = new AudioContext()
const analyserNode = new AnalyserNode(context, { fftSize: 256 })
const gainNode = new GainNode(context, {gain: volume.value})
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
const reverbEQ = new ConvolverNode(context, {
    type: 'highpass',
    frequency: 1000,
    gain: reverb.value
})

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
    reverb.addEventListener('input', e => {
        const value = parseInt(e.target.value);
        reverbEQ.gain.setTargetAtTime(value, context.currentTime, .01)
    })
}

function impulseResponse(duration, decay) { 
    var length = context.sampleRate * duration
    var impulse = context.createBuffer(2, length, context.sampleRate)
    var myImpulse = impulse.getChannelData(0)
    for (let i = 0; i < length; i++) {
        myImpulse[i] = (2*Math.random()-1)*Math.pow(1-i/length, decay)
    }
    return impulse;
}

var sine = new OscillatorNode(context,{type: 'sine'})
sine.start();
var amplitude = new GainNode(context)
amplitude.gain.setValueAtTime(0,context.currentTime+0.1) // pulse last 100ms
var impulse = impulseResponse(3,1) // 1 second impulse, with decay value of 2
var convolver = new ConvolverNode(context, {buffer:impulse})



async function setupContext(){
    console.log('getting mic')
    const mic = await getMic()
    if (context.state === "suspended") {
        await context.resume()
        const source = context.createMediaStreamSource(mic)
        source
            // .connect(bassEQ)
            // .connect(midEQ)
            // .connect(trebleEQ)
            .connect(gainNode)
            .connect(analyserNode)
            .connect(context.destination)
    }
    

        //drawVisualizer();
        sine.connect(amplitude)
        amplitude.connect(convolver)
        convolver.connect(context.destination)
        impulseResponse(3,1)
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





// function drawVisualizer() {
//     requestAnimationFrame(drawVisualizer);

//     const bufferLength = analyserNode.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength)
//     analyserNode.getByteFrequencyData(dataArray)
//     const width = visualizer.style.width
//     const height = visualizer.style.height
//     const barWidth = width / bufferLength;

//     const canvasContext = visualizer.getContext('2d')
//     canvasContext.clearRect(0, 0, width, height)

//     dataArray.forEach((item, index) => {
//         const y = item / 255 * height / 2
//         const x = barWidth * index

//         canvasContext.fillStyle = 'rgb(0,0,0)'
//         canvasContext.fillRect(x, height - y ,barWidth, y)
//     })
// }

