// get the DOM elements that will serve us to control audio:
const soundCtrl = document.getElementById('sound-img');

//get sound elements 
let sounds = document.querySelectorAll('audio');

function checkSound() {
    let soundStatus = soundCtrl.getAttribute('src');
    return soundStatus === 'images/Speaker_Icon.svg' ? true : false;
}

function setSound() {    
    if (checkSound()) {
        soundCtrl.setAttribute('src', 'images/Mute_Icon.svg');
        sounds.forEach(sound => sound.muted = true)
    } else {
        soundCtrl.setAttribute('src', 'images/Speaker_Icon.svg');
        sounds.forEach(sound => sound.muted = false)
        if(gameIsOn){
            playAudio('gameAudio');
            pauseAudio('bgAudio');
        } else {         
            myCanvas.style.backgroundImage === `url("images/game-background.jpg")` ? playAudio('bgAudio') : playAudio('bgLooseAudio');
            pauseAudio('gameAudio');
        }
    }
}
function setAudioToZero(audio){
    document.getElementById(audio).currentTime = 0;
}

function playAudio(audio) {
    document.getElementById(audio).play();
}

function pauseAudio(audio) {
    document.getElementById(audio).pause();
}
function countdownAudio(){
    (checkSound() && chronometer.timesIsUp() === "00:05") ? playAudio('timer'):"";
}