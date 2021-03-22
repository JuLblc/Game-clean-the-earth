class Chronometer {
    constructor() {
      // ... your code goes here
      this.currentTime = 120;
      this.intervalId = 0;
  
    }
    startClick(callback) {
        this.intervalId = setInterval(()=>{
        this.currentTime --;
        if (callback){callback()};
      },1000);
    }
    getMinutes() {     
      return Number(Math.trunc(this.currentTime/60));
    }
    getSeconds() {     
      return Number(this.currentTime % 60);
    }
    twoDigitsNumber(myTime) {     
      return myTime.toString().length === 2 ? myTime.toString() : "0" + myTime.toString();
    }
    stopClick() {
      clearInterval(this.intervalId);
    }
    resetClick() {
      this.currentTime = 120;
    }
    splitClick() {
      return `${this.twoDigitsNumber(this.getMinutes())}:${this.twoDigitsNumber(this.getSeconds())}`;
    }
    timesIsUp(){
      if (this.splitClick() === "00:00"){
        this.stopClick();
        return "Time's up";
      } else {
        return this.splitClick();
      }
    }
  }
