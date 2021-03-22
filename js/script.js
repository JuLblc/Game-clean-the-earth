const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('countdown');

// const ctx = document.querySelector('canvas').getContext('2d');
// const W = ctx.canvas.width;
// const H = ctx.canvas.height;

const myCanvas = document.querySelector('#playing-area');
const ctx = myCanvas.getContext('2d');
const H = myCanvas.clientHeight;
const W = myCanvas.clientWidth;
console.log(W,H);

let gameover = false;
let gameIsOn = false;
let projectile;

function setPauseBtn() {   
    //btnPause disabled au chargement de la page 
    if(pauseBtn.disabled){
        pauseBtn.disabled  = false;
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

let frames = 0;
function animLoop() {
  frames++;
  projectile.draw();

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
    
    if (checkSound()){
        setAudioToZero('gameAudio');
        playAudio('gameAudio');
        pauseAudio('bgAudio');
    };
    
    projectile = new Projectile();  
    animLoop();
  }

restartBtn.addEventListener('click', () => {   
    startGame(); 
})

pauseBtn.addEventListener('click', () => {
    let pauseBtnStatus = pauseBtn.value;

    if (pauseBtnStatus === 'Pause') {
        gameIsOn = false;
        chronometer.stopClick();
        setResumeBtn();
        if (checkSound()){
            playAudio('bgAudio');
            pauseAudio('gameAudio');
        };
    }
    if (pauseBtnStatus === 'Resume') {
        gameIsOn = true;
        chronometer.startClick(printTime);
        setPauseBtn();
        if (checkSound()){
            playAudio('gameAudio');
            pauseAudio('bgAudio');
        };
    }
})

soundCtrl.addEventListener('click', () => {
    setSound();
})