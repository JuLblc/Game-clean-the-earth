const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('countdown');

let gameIsOn = false;

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

restartBtn.addEventListener('click', () => {    
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