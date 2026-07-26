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