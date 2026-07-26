const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');

let time = 0;
let level = 1;

// Target Signal (Jo player ko match karna hai)
let targetSignal = {
    type: 'sine',
    freq: 3,
    amp: 60
};


// DOM Elements
const waveTypeInput = document.getElementById('waveType');
const freqInput = document.getElementById('frequency');
const ampInput = document.getElementById('amplitude');
const statusText = document.getElementById('status');
const levelDisplay = document.getElementById('level-display');


// Random signal generator next level ke liye
function generateNewTarget() {
    const types = ['sine', 'square', 'triangle'];
    targetSignal.type = types[Math.floor(Math.random() * types.length)];
    targetSignal.freq = (Math.floor(Math.random() * 18) + 2) / 2; 
    targetSignal.amp = Math.floor(Math.random() * 16) * 5 + 20;
}

// Random signal generator next level ke liye
function generateNewTarget() {
    const types = ['sine', 'square', 'triangle'];
    targetSignal.type = types[Math.floor(Math.random() * types.length)];
    targetSignal.freq = (Math.floor(Math.random() * 18) + 2) / 2; 
    targetSignal.amp = Math.floor(Math.random() * 16) * 5 + 20;
}

// Wave ka Y-coordinate calculate karna
function calculateY(type, x, t, freq, amp) {
    let phase = (x * 0.02 * freq) - t; 
    
    if (type === 'sine') {
        return Math.sin(phase) * amp;
    } else if (type === 'square') {
        return Math.sign(Math.sin(phase)) * amp;
    } else if (type === 'triangle') {
        return Math.asin(Math.sin(phase)) * (2 / Math.PI) * amp;
    }
    return 0;
}

// Canvas par wave draw karna
function drawWave(type, freq, amp, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;


}
