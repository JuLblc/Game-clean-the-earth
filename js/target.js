const images = ['cartman_hitler_icon.png', 'pablo.png', 'hanouna.png', 'kim.png', 'alcapone.png', 'trump4.png', 'vladimir-putin-icon.png'];
const bonusSound = ['killingspree', 'multikill', 'unstoppable', 'dominating'];
const sensArr = [-1, 1];
const speedArr = [[5, 2], [4, 3]];


function random(from, to) {
    return Math.floor(from + Math.random() * (to - from));
}

class Target {
    constructor(point) {

        this.point = point;
        let subSpeedArr = speedArr[random(0, speedArr.length)];
        const imgTarget = document.createElement('img');

        imgTarget.onload = () => {
            this.imgTarget = imgTarget;

            const imgRatio = imgTarget.naturalWidth / imgTarget.naturalHeight;

            this.w = 60 - waveNbr * 5;
            this.h = this.w / imgRatio;
            //Pour éviter la noGoZone            
            // this.x = random(0, W - this.w);
            // if ((this.x + this.w < noGoZone.x) || (this.x > noGoZone.x + noGoZone.w)) {
            //     this.y = random(0, H - this.h);
            // } else {
            //     this.y = random(0, noGoZone.y - this.h);
            // }
            this.x = random(0, W - this.w);
            this.y = random(0, H - this.h);
            // sens de déplacement {x,y} x = 1:droite, x = -1:gauche, y = -1:haut, y = 1:bas
            this.sens = {};
            this.sens.x = sensArr[random(0, sensArr.length)]; // Initialisation aléatoire. Soit -1 soit 1
            this.sens.y = sensArr[random(0, sensArr.length)];

            //Vitesse de déplacement 
            this.speed = {};
            this.speed.x = subSpeedArr[0];
            this.speed.y = subSpeedArr[1];

        }
        imgTarget.src = "images/" + images[random(0, images.length)];
    }
    draw() {
        if (!this.imgTarget) return; // if `this.imgTarget` is not loaded yet => don't draw
        this.moveTarget();
        ctx.drawImage(this.imgTarget, this.x, this.y, this.w, this.h);
    }

    crashWith(a, b) {
        return (
            a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
        );
    }

    moveTarget() {
        this.x += this.speed.x * this.sens.x;
        this.y += this.speed.y * this.sens.y;
        //Change direction avant de sortir du Canvas
        if (this.x + this.w > W || this.x < 0) {
            this.sens.x *= -1;
        }
        if (this.y + this.h > H || this.y < 0) {
            this.sens.y *= -1;
        }

        // Change direction si rentre dans la noGoZone
        // TEST 1 => Not working problème sur les bords de la noGoZone
        // if (this.crashWith(this, noGoZone)) {
        //     console.log("crashed", "x:",this.x,"y:", this.y,"sens.x:",this.sens.x,"sens.y",this.sens.y);
        //     if ((this.x + this.w > noGoZone.x && this.sens.x === 1) || (this.x < noGoZone.x + noGoZone.w && this.sens.x === -1)) {
        //         this.sens.x *= -1;
        //     }
        //     if (this.x > noGoZone.x && this.x + this.w < noGoZone.x + noGoZone.w && this.sens.y === 1) {
        //         this.sens.y *= -1;
        //         this.sens.x *= -1;
        //     }
        // }
        
        // TEST 2 => IDEM
        // if (this.y + this.h > H - 300) {
        //     if (((this.x + this.w > 400) && (this.x < 800) && (this.sens.x === 1)) || ((this.x + this.w > 400) && (this.x < 800) && (this.sens.x === -1))) {
        //         this.sens.x *= -1;
        //     }
        //     if ((this.x > 400) && (this.x + this.w < 800) && (this.sens.y === 1)) {
        //         this.sens.y *= -1;
        //         this.sens.x *= -1;
        //     }
        //     console.log("x:",this.x, "x + w:", this.x + this.w,"y:",this.y);
        // }
    }
}