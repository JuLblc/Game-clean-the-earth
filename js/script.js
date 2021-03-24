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
    if (projectiles.length === maxAmmo) {
        // console.log("out of ammo");
        drawOutOfAmmo();
    }
    projectiles.forEach((projectile, idx) => {
        if (projectile.checkIfOut()) {
            projectiles.splice(idx, 1);
        } else {
            projectile.draw();
        }
    })

    // projectiles.forEach(projectile => projectile.draw());
}

function setPauseBtn() {
    //btnPause disabled au chargement de la page et après gameover
    if (pauseBtn.disabled) {
        pauseBtn.disabled = false;
        pauseBtn.classList.remove('disabled');
    }
    //btnPause to disabled when game over
    if (gameover) {
        pauseBtn.disabled = true;
        pauseBtn.classList.add('disabled');
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

const imgOutofAmmo = document.createElement('img');
imgOutofAmmo.src = "images/save-water.svg";
const wImgOutOfAmmo = 45;
const hImgOutOfAmmo = wImgOutOfAmmo / 0.8866;
const xImgOutOfAmmo = W - wImgOutOfAmmo - W / 120;
const yImgOutOfAmmo = H / 60;

function drawOutOfAmmo() {
    if (!imgOutofAmmo) {
        console.log('image outOfAmmo non chargée');
        return; // if `imgOutofAmmo` is not loaded yet => don't draw
    }
    // console.log(,xImgOutOfAmmo,yImgOutOfAmmo,wImgOutOfAmmo,hImgOutOfAmmo);
    ctx.drawImage(imgOutofAmmo, xImgOutOfAmmo, yImgOutOfAmmo, wImgOutOfAmmo, hImgOutOfAmmo);
}

let frames = 0;
function animLoop() {
    frames++;
    draw();

    if (!gameover) {
        raf = requestAnimationFrame(animLoop);
    } else {
        gameIsOn = false;
        ctx.clearRect(0, 0, W, H);
        myCanvas.style.backgroundImage = "url('images/game-over-time.jpg')";
        chronometer.stopClick();
        setPauseBtn();
        pauseAudio('gameAudio');
        playAudio('bgLooseAudio');
    }
}

let raf;
function startGame() {
    if (raf) {
        cancelAnimationFrame(raf);
    }

    projectiles = [];
    gameover = false;
    myCanvas.style.backgroundImage = "url('images/game-background.jpg')";
    gameIsOn = true;
    chronometer.stopClick();
    chronometer.resetClick();
    chronometer.startClick(printTime);
    setPauseBtn();

    if (checkSound()) {
        setAudioToZero('gameAudio');
        playAudio('gameAudio');
        pauseAudio('bgAudio');
        pauseAudio('bgLooseAudio');
    };

    animLoop();
}

//onkeydow pour test gameover
document.addEventListener('keydown', event => {
    event.key === "s" ? gameover = true : gameover = false;
    console.log(gameover);
});

restartBtn.addEventListener('click', () => {
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

const maxAmmo = 3;
myCanvas.addEventListener('click', (e) => {
    let dest = getProjectileDestination(myCanvas, e);
    if (gameIsOn && projectiles.length < maxAmmo) {
        projectiles.push(new Projectile(dest, 2));
        playAudio('bubbles');
    } else if(projectiles.length === maxAmmo){
        playAudio('outOfAmmo');
    }
})

soundCtrl.addEventListener('click', () => {
    setSound();
})