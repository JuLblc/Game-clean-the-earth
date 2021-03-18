const chronometer = new Chronometer();

// get the buttons:
const restartBtn = document.getElementById('restart');
const pauseBtn = document.getElementById('pause');

// get the DOM elements that will serve us to display the time:
let timeRemaining = document.getElementById('countdown');

function setPauseBtn() {
    pauseBtn.value = "Pause";
}

function setResumeBtn() {
    pauseBtn.value = "Resume";
}

function printTime() {
    if (chronometer.timesIsUp() === "Time's up"){
        document.getElementById('time').innerHTML = "";
    }
    timeRemaining.innerHTML = chronometer.timesIsUp();
}

restartBtn.addEventListener('click',()=>{ 
    chronometer.stopClick();
    chronometer.resetClick();
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