const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('countdown');
let displayScore = document.getElementById('score');
let displayAccuracy = document.getElementById('accuracy');
let displayAmmo = document.getElementById('ammo');
let typeWriterHTML = document.querySelector('#typewriter'); //pour l'intro
let playingInfoHTML = document.getElementById('playing-info'); // Parent de l'élément à supp
let introHTML = document.querySelector('.absolute'); // Enfant à supp

const myCanvas = document.querySelector('canvas');
myCanvas.style.backgroundImage = "url('images/game-background.jpg')";

const ctx = myCanvas.getContext('2d');
const W = ctx.canvas.width;
const H = ctx.canvas.height;
// const noGoMinW = 400;
// const noGoMaxW = 800;
// const noGoH = H - 300;

let gameIsOn = false;
let projectiles = [];
let targets = [];
let splashes = [];
let scores = [];
let points = 0;
let usedAmmo = 0;
let targetReached = 0;
let accuracy = 0;

//Image watergushing
const wImgWaterGush = 60;
const imgWaterGush = new Objet("images/watergun.png", wImgWaterGush, W / 2 - wImgWaterGush / 2, H - 80);

//Image splash
const wImgSplash = 45;

//Image out of Ammo
const wImgOutOfAmmo = 45;
const imgOutofAmmo = new Objet("images/save-water.svg", wImgOutOfAmmo, W - wImgOutOfAmmo - W / 120, H / 60);

function draw() {//function appelé en continue
    ctx.clearRect(0, 0, W, H);
    // ctx.globalAlpha = 0.2;
    // ctx.fillRect(400,H-300,400,300);
    // ctx.globalAlpha = 1;

    imgWaterGush.draw();
    if (projectiles.length === maxAmmo) {
        imgOutofAmmo.draw();
    }
    projectiles.forEach((projectile, idx) => {
        if (projectile.checkIfOut()) {
            projectiles.splice(idx, 1);
            updateAccuracy();
        } else {
            projectile.draw();
            //Si projectile atteint cible
            if (projectile.hits(targets)) {
                projectiles.splice(idx, 1); // supp projectile du tableau                
                updateAccuracy();
            };
        }
    })

    targets.forEach(target => target.draw());
    splashes.forEach((splash, idx) => {
        //splashes affichés pendant 60 frames
        (frames + 1 - splash.frame) % 60 === 0 ? splashes.splice(idx, 1) : splash.draw();
    })
    scores.forEach((score, idx) => {
        //scores affichés pendant 60 frames
        (frames + 1 - score.frame) % 60 === 0 ? scores.splice(idx, 1) : score.draw();
    })
}

function updateAmmo() {
    ammo = maxAmmo - projectiles.length;
    displayAmmo.innerHTML = `${maxAmmo - projectiles.length}/${maxAmmo}`;
    //Style
    if (ammo <= 1) {//De 0 à 1 => rouge
        displayAmmo.style.color = "#e50513"; 
        document.querySelector('#img-ammo').setAttribute('src', 'images/robinet-rouge.svg');
    } else if ((ammo > 1) && (ammo <= 3)) {//De 1 à 3 => Orange
        displayAmmo.style.color = "#F6830F";
        document.querySelector('#img-ammo').setAttribute('src', 'images/robinet-orange.svg');
    } else {// Sinon vert
        displayAmmo.style.color = "#024400";
        document.querySelector('#img-ammo').setAttribute('src', 'images/robinet-green.svg');
    }
}

function updateScore(pointWave) {
    points += 8 + pointWave;
    displayScore.innerHTML = points;
}

function updateAccuracy() {
    accuracy = Math.round(targetReached * 100 / (usedAmmo - projectiles.length));
    displayAccuracy.innerHTML = accuracy + "%";
    //Style
    if (accuracy <= 25) {//De 0 à 25% => rouge
        displayAccuracy.style.color = "#e50513";
        document.querySelector('#img-accuracy').setAttribute('src', 'images/accuracy-red.svg');
    } else if ((accuracy > 25) && (accuracy <= 75)) {//De 25% à 75% => Orange
        displayAccuracy.style.color = "#F6830F";
        document.querySelector('#img-accuracy').setAttribute('src', 'images/accuracy-orange.svg');
    } else {// Sinon vert
        displayAccuracy.style.color = "#024400";
        document.querySelector('#img-accuracy').setAttribute('src', 'images/accuracy-green.svg');
    }
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

let waveNbr = 0;
function generateTargetWave() {
    waveNbr++;
    for (let i = 0; i < 5; i++) {  //5 targets par vague
        targets.push(new Target(waveNbr * 2));
    }
}

function printIntro(content) {
    let spans = [];
    let childSpan;

    for (let i = 0; i < content.length; i++) {
        childSpan = document.createElement('span');
        childSpan.innerHTML = content[i];
        spans.push(childSpan);
    }

    spans.forEach((span, i) => {
        setTimeout(() => {
            typeWriterHTML.appendChild(span);
        }, i * 100);
    });
}

let frames = 0;
let framesBeforeWave = 0;
function animLoop() {   //function appelé en continue    
    // gestion jeu en pause
    if (gameIsOn) {
        frames++;
        framesBeforeWave++;
        draw();

        //Création de la vague de target quand plus de target ou toutes les 15 secondes
        if ((targets.length === 0) || (framesBeforeWave % 900 === 0)) {
            generateTargetWave();
            framesBeforeWave = 0;
        }
    }

    //Son et style chrono
    countdownAudio();
    chronometer.timesIsUp() === "00:05" ? document.querySelector('#countdown').classList.add('count') : "";
    chronometer.timesIsUp() === "00:05" ? document.querySelector('#time').setAttribute('src', 'images/timer red.svg') : "";

    updateAmmo();

    if (!gameOver()) {
        raf = requestAnimationFrame(animLoop);
    } else {
        gameIsOn = false;
        ctx.clearRect(0, 0, W, H);
        myCanvas.style.backgroundImage = "url('images/game-over-time.jpg')";
        chronometer.stopClick();
        setPauseBtn();
        checkSound() ? pauseAudio('gameAudio') : "";
        checkSound() ? playAudio('gameOver') : "";
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
    splashes = [];
    scores = [];
    points = 0;
    usedAmmo = 0;
    ammo = maxAmmo;
    accuracy = 0;
    targetReached = 0;
    waveNbr = 0;
    gameIsOn = true;
    //MAJ info du jeu
    timeRemaining.innerHTML = "01:00";
    displayScore.innerHTML = points;
    displayAccuracy.innerHTML = "0%";
    updateAmmo();
    //Style
    myCanvas.style.backgroundImage = "url('images/game-background.jpg')";
    restartBtn.value = "Clean Again!";
    restartBtn.classList.remove('clignote');
    document.body.contains(introHTML) ? playingInfoHTML.removeChild(introHTML) : "";
    displayAccuracy.style.color = "black";
    document.querySelector('#img-accuracy').setAttribute('src', 'images/accuracy.svg');
    //Ré-initialisation chronomètre
    document.querySelector('#time').setAttribute('src', 'images/timer.svg')
    document.querySelector('#countdown').classList.remove('count');
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
function gameOver() {
    return (chronometer.timesIsUp() === "Time's up" || targets.length > maxTarget) ? true : false;
}

// onkeydown pour test création target
document.addEventListener('keydown', event => {
    event.key === "t" ? targets.push(new Target()) : "";
    //     event.key === "m" ? targets.forEach(target => target.moveTarget()) : "";  
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

const maxAmmo = 5;
let ammo = maxAmmo;
myCanvas.addEventListener('click', (e) => {
    let dest = getProjectileDestination(myCanvas, e);
    if (gameIsOn && projectiles.length < maxAmmo) {
        usedAmmo++;
        projectiles.push(new Projectile(dest, 3));
        checkSound() ? playAudio('bubbles') : "";
    } else if (projectiles.length === maxAmmo) {
        checkSound() ? playAudio('outOfAmmo') : "";
    }
})

//A l'initialisation de la page
printIntro("Don't you think we should take great care of our planet? Engage yourself and enjoy splashing some bad guys!!");

soundCtrl.addEventListener('click', () => {
    setSound();
})