const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('countdown');
let displayScore = document.getElementById('score');
let displayAccuracy = document.getElementById('accuracy');

const myCanvas = document.querySelector('#playing-area');
myCanvas.style.backgroundImage = "url('images/game-background.jpg')";

const ctx = myCanvas.getContext('2d');
const W = ctx.canvas.width;
const H = ctx.canvas.height;

let gameIsOn = false;
let projectiles = [];
let targets = [];
let points = 0;
let usedAmmo = 0;
let targetReached = 0;
let accuracy = 0;

//function appelé en continue
function draw() {
    ctx.clearRect(0, 0, W, H);
    if (projectiles.length === maxAmmo) {
        drawOutOfAmmo();
    }
    projectiles.forEach((projectile, idx) => {
        if (projectile.checkIfOut()) {
            projectiles.splice(idx, 1);
            updateAccuracy();
        } else {
            projectile.draw();
            //Si projectile atteint cible
            if (projectile.hits(targets)){
                projectiles.splice(idx, 1); // supp projectile du tableau
                //afficher image splash
                updateScore();
                updateAccuracy();
                // check augmentation difficulté
            };
        }
    })

    targets.forEach(target => target.draw());
}

function updateScore(){
    points += 10;
    displayScore.innerHTML = points;
}

function updateAccuracy(){
    accuracy = Math.round(targetReached * 100 / (usedAmmo - projectiles.length));
    displayAccuracy.innerHTML = accuracy + "%";
}

function setPauseBtn() {
    //btnPause disabled au chargement de la page et après gameover
    if (pauseBtn.disabled) {
        pauseBtn.disabled = false;
        pauseBtn.classList.remove('disabled');
    }
    //btnPause to disabled when game over
    if (gameOver()) {
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

    if (!gameOver()) {
        raf = requestAnimationFrame(animLoop);
    } else {
        gameIsOn = false;
        ctx.clearRect(0, 0, W, H);
        myCanvas.style.backgroundImage = "url('images/game-over-time.jpg')";
        chronometer.stopClick();
        setPauseBtn();
        checkSound() ? pauseAudio('gameAudio') : "";
        checkSound() ? playAudio('gameOver'): "";
        checkSound() ? playAudio('bgLooseAudio') : "";
    }
}

let raf;
function startGame() {
    if (raf) {
        cancelAnimationFrame(raf);
    }
    //Ré-initialisation variable
    projectiles = [];
    targets = [];
    points = 0;
    usedAmmo = 0;
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

const maxTarget = 10;
function gameOver(){
    return (chronometer.timesIsUp() === "Time's up" || targets.length === maxTarget) ? true : false;
}

//onkeydow pour test création target
document.addEventListener('keydown', event => {
    event.key === "t" ? targets.push(new Target()) : "";
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

const maxAmmo = 10;
myCanvas.addEventListener('click', (e) => {
    let dest = getProjectileDestination(myCanvas, e);
    if (gameIsOn && projectiles.length < maxAmmo) {
        usedAmmo++;
        projectiles.push(new Projectile(dest, 3));
        checkSound() ? playAudio('bubbles'): "" ;        
    } else if(projectiles.length === maxAmmo){
        checkSound() ? playAudio('outOfAmmo'): "" ;
    }
})

soundCtrl.addEventListener('click', () => {
    setSound();
})