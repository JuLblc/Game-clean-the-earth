const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('countdown');

const myCanvas = document.querySelector('#playing-area');
const ctx = myCanvas.getContext('2d');
// const ctx = document.querySelector('canvas').getContext('2d');
// const W = ctx.canvas.width;
// const H = ctx.canvas.height;

const H = myCanvas.clientHeight;
const W = myCanvas.clientWidth;

const CanvasW = ctx.canvas.width;
const CanvasH = ctx.canvas.height;
console.log('canvas origin dimension', CanvasW, CanvasH);

ctx.canvas.width = W;
ctx.canvas.height = H;

console.log("client dimension", W, H);
console.log('canvas new dimension ', ctx.canvas.width, ctx.canvas.height)

let gameover = false;
let gameIsOn = false;
let projectiles = [];

//function appelé en continue
function draw() {
    ctx.clearRect(0, 0, W, H);
    projectiles.forEach(projectile => projectile.draw());
}

function setPauseBtn() {
    //btnPause disabled au chargement de la page 
    if (pauseBtn.disabled) {
        pauseBtn.disabled = false;
        pauseBtn.classList.remove('disabled');
    }
    pauseBtn.value = "Pause";
}

function setResumeBtn() {
    pauseBtn.value = "Resume";
}

function printTime() {
    timeRemaining.innerHTML = chronometer.timesIsUp();
}

function getProjectileDestination(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return { x, y };
}

let frames = 0;
function animLoop() {
    frames++;
    draw();

    if (!gameover) {
        raf = requestAnimationFrame(animLoop);
    }
}

let raf;
function startGame() {
    if (raf) {
        cancelAnimationFrame(raf);
    }

    gameIsOn = true;
    chronometer.stopClick();
    chronometer.resetClick();
    chronometer.startClick(printTime);
    setPauseBtn();

    if (checkSound()) {
        setAudioToZero('gameAudio');
        playAudio('gameAudio');
        pauseAudio('bgAudio');
    };

    animLoop();
}

restartBtn.addEventListener('click', () => {
    projectiles = [];
    startGame();
})

pauseBtn.addEventListener('click', () => {
    let pauseBtnStatus = pauseBtn.value;

    if (pauseBtnStatus === 'Pause') {
        gameIsOn = false;
        chronometer.stopClick();
        setResumeBtn();
        if (checkSound()) {
            playAudio('bgAudio');
            pauseAudio('gameAudio');
        };
    }
    if (pauseBtnStatus === 'Resume') {
        gameIsOn = true;
        chronometer.startClick(printTime);
        setPauseBtn();
        if (checkSound()) {
            playAudio('gameAudio');
            pauseAudio('bgAudio');
        };
    }
})

myCanvas.addEventListener('click', (e) => {
    let dest = getProjectileDestination(myCanvas, e);
    if (gameIsOn) {
        projectiles.push(new Projectile(dest,2));
    }
    console.log(projectiles);
})

soundCtrl.addEventListener('click', () => {
    setSound();
})