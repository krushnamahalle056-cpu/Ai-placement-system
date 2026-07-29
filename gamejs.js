const canvas = document.getElementById('oscilloscope');
const ctx = canvas.getContext('2d');

let time = 0;
let level = 1;

// Naye variables Time aur Score ke liye
let score = 0;
let timeLeft = 45; // Har level ke liye 45 seconds
let timerInterval;
let isGameOver = false;
let isTransitioning = false; // NAYA VARIABLE ADD KIYA

// Audio Context Variables
let audioCtx;
let oscillator;
let gainNode;
let isAudioPlaying = false;

// Target Signal (Jo player ko match karna hai)
let targetSignal = {
    type: 'sine',
    freq: 3,
    amp: 60,
    phase: 0,
};

// DOM Elements
const waveTypeInput = document.getElementById('waveType');
const freqInput = document.getElementById('frequency');
const ampInput = document.getElementById('amplitude');
const statusText = document.getElementById('status');
const levelDisplay = document.getElementById('level-display');
const scoreDisplay = document.getElementById('score-display');
const timerDisplay = document.getElementById('timer-display');
const syncButton = document.querySelector('button');
const phaseInput = document.getElementById('phase');

// Random signal generator next level ke liye
function generateNewTarget() {
    const types = ['sine', 'square', 'triangle'];
    targetSignal.type = types[Math.floor(Math.random() * types.length)];
    targetSignal.freq = (Math.floor(Math.random() * 18) + 2) / 2; 
    targetSignal.amp = Math.floor(Math.random() * 16) * 5 + 20;
    targetSignal.phase = Math.floor(Math.random() * 5) * 45;
}

// Timer Logic
function startTimer() {
    clearInterval(timerInterval);
    timerDisplay.classList.remove('time-low');
    
    timerInterval = setInterval(() => {
        if (isGameOver) return;
        
        timeLeft--;
        timerDisplay.innerText = timeLeft;

        // Agar 5 second se kam bache toh CSS animation lagao
        if (timeLeft <= 5) {
            timerDisplay.classList.add('time-low');
        }

        // Time khatam hone par
        if (timeLeft <= 0) {
            gameOver();
        }
    }, 1000);
}

function gameOver() {
    clearInterval(timerInterval);
    isGameOver = true;
    statusText.style.color = "#ff0000";
    statusText.innerText = "TIME OUT! SYSTEM CRASHED. Final Score: " + score;
    
    // Button ko Restart button mein badal do
    syncButton.innerText = "Restart System";
    syncButton.onclick = restartGame;
}

function restartGame() {
    isGameOver = false;
    level = 1;
    score = 0;
    timeLeft = 45;
    
    levelDisplay.innerText = level;
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft;
    
    generateNewTarget();
    
    // Button ko wapas normal kar do
    syncButton.innerText = "Sync Signal";
    syncButton.onclick = checkSync; 
    
    statusText.style.color = "#ff0055";
    statusText.innerText = "Adjust parameters to match the red signal...";
    
    waveTypeInput.value = 'sine';
    freqInput.value = 1;
    ampInput.value = 50;
    
    startTimer();
}

// Wave ka Y-coordinate calculate karna (Phase shift ke sath)
function calculateY(type, x, t, freq, amp, phaseDeg) {
    // Degrees to Radians conversion
    let phaseRad = phaseDeg * (Math.PI / 180); 
    // Time shifting logic
    let wavePhase = (x * 0.02 * freq) - t + phaseRad; 
    
    if (type === 'sine') return Math.sin(wavePhase) * amp;
    if (type === 'square') return Math.sign(Math.sin(wavePhase)) * amp;
    if (type === 'triangle') return Math.asin(Math.sin(wavePhase)) * (2 / Math.PI) * amp;
    return 0;
}

// Canvas par wave draw karna
function drawWave(type, freq, amp, phase, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;

    for (let x = 0; x < canvas.width; x++) {
        let y = canvas.height / 2 + calculateY(type, x, time, freq, amp, phase);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; 
}

// Animation Loop 
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.strokeStyle = '#003322';
    ctx.lineWidth = 1;
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

// Target Wave (Red)
    drawWave(targetSignal.type, targetSignal.freq, targetSignal.amp, targetSignal.phase, '#ff0055', 3);

    // Player Wave (Cyan)
    let playerType = waveTypeInput.value;
    let playerFreq = parseFloat(freqInput.value);
    let playerAmp = parseFloat(ampInput.value);
    let playerPhase = parseFloat(phaseInput.value); // Naya input
    drawWave(playerType, playerFreq, playerAmp, playerPhase, '#00ffcc', 3);

    time += 0.05; 
    requestAnimationFrame(animate);
}

// Sync checking logic
function checkSync() {
    // BUG FIX: Agar game over hai YA next level load ho raha hai, toh click ko ignore karo
    if (isGameOver || isTransitioning) return; 

    let playerType = waveTypeInput.value;
    let playerFreq = parseFloat(freqInput.value);
    let playerAmp = parseFloat(ampInput.value);
    let playerPhase = parseFloat(phaseInput.value);

    // Ab 4 cheezein match honi chahiye
    if (playerType === targetSignal.type && 
        playerFreq === targetSignal.freq && 
        playerAmp === targetSignal.amp &&
        playerPhase === targetSignal.phase) {
        
        clearInterval(timerInterval); // Timer turant rok do
        isTransitioning = true;       // Game ko transition state (loading) mein daalo
        
        let pointsEarned = 100 + (timeLeft * 10);
        score += pointsEarned;
        scoreDisplay.innerText = score;

        statusText.style.color = "#00ffcc";
        statusText.innerText = `SYSTEM SYNCED! +${pointsEarned} Pts. Next level...`;
        
        setTimeout(() => {
            level++;
            levelDisplay.innerText = level;
            generateNewTarget();
            
           // Naye level ke liye time properly reset karo
            timeLeft = 45; // Ise 15 se badalkar 45 kar dein
            timerDisplay.classList.remove('time-low'); // Red flash hatao
            timerDisplay.innerText = timeLeft;
            
            statusText.innerText = "Adjust parameters to match the red signal...";
            statusText.style.color = "#ff0055";
            
            // Sliders reset karo
            waveTypeInput.value = 'sine';
            freqInput.value = 1;
            ampInput.value = 50;
            phaseInput.value = 0;
            
            isTransitioning = false; // Transition khatam
            startTimer(); // Naya timer start karo
        }, 2000);

    } else {
        statusText.style.color = "#ff0000";
        statusText.innerText = "SYNC FAILED. Parameters do not match.";
        setTimeout(() => {
            if (!isGameOver && !isTransitioning) {
                statusText.innerText = "Adjust parameters to match the red signal...";
                statusText.style.color = "#ff0055";
            }
        }, 1500);
    }
}

// Game Start karte hi timer aur animation chalu karein
animate();
startTimer();

// --- WEB AUDIO API ENGINE ---

function toggleAudio() {
    // Agar audio system abhi tak start nahi hua hai, toh usko banayein
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
    }
    
    const audioBtn = document.getElementById('audio-toggle');

 
}