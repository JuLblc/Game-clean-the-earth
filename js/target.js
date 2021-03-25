const images = ['cartman_hitler_icon.png','pablo.png','hanouna.png','kim.png','terrorist.jpg','kitty.png','trump1.png','trump2.png'];
const sensArr =[-1,1];
const speedArr =[[2,5],[5,2],[3,4],[4,3]];


function random(from, to) {
    return Math.floor(from + Math.random() * (to - from));
}

class Target {
    constructor(){
        console.log("creation target");

        let subSpeedArr = speedArr[random(0,speedArr.length)];
        const imgTarget = document.createElement('img');
         
        imgTarget.onload = () => {
            this.imgTarget = imgTarget;

            const imgRatio = imgTarget.naturalWidth / imgTarget.naturalHeight;

            this.w = 60;
            this.h = this.w / imgRatio;
            this.x = random(0, W - this.w);    //x de départ
            this.y = random(0, H - this.h);    //y de départ

            // sens de déplacement {x,y} x = 1:droite, x = -1:gauche, y = -1:haut, y = 1:bas
            this.sens = {};
            this.sens.x = sensArr[random(0,sensArr.length)]; // Initialisation aléatoire. Soit -1 soit 1
            this.sens.y = sensArr[random(0,sensArr.length)];

            //Vitesse de déplacement 
            this.speed = {};
            this.speed.x = subSpeedArr[0];
            this.speed.y = subSpeedArr[1];

        }
        imgTarget.src = "images/" + images[random(0,images.length)];
    }
    draw() {
        if (!this.imgTarget) {
            console.log('image drop non chargée');
            return; // if `this.imgDrop` is not loaded yet => don't draw
        }
        // console.log("dessin target", "x:", this.ac.x, "y:", this.ac.y);
        this.moveTarget();   
        ctx.drawImage(this.imgTarget, this.x, this.y, this.w, this.h);        
    }
    moveTarget(){
        this.x += this.speed.x * this.sens.x;
        this.y += this.speed.y * this.sens.y;
        //Change direction avant de sortir du Canvas
        let xToCheck = this.x + this.speed.x * this.sens.x;
        let yToCheck = this.y + this.speed.y * this.sens.y;
        if (xToCheck + this.w > W || xToCheck < 0){
            this.sens.x *= -1;
        }
        if (yToCheck + this.h > H || yToCheck < 0){
            this.sens.y *= -1;
        }
    }

}