const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('timer');

function setPauseBtn() {
    pauseBtn.value = "Pause";
}

function setResumeBtn() {
    pauseBtn.value = "Resume";
}

function printTime() {
    timeRemaining.innerHTML = chronometer.splitClick();
}

restartBtn.addEventListener('click',()=>{
    chronometer.startClick(printTime);
})

pauseBtn.addEventListener('click',()=>{
    let pauseBtnStatus = pauseBtn.value;

    if (pauseBtnStatus === 'Pause'){
        chronometer.stopClick();
        setResumeBtn();
    }
    if (pauseBtnStatus === 'Resume'){
        chronometer.startClick(printTime);
        setPauseBtn();
    }    
})