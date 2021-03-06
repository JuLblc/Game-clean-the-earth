class Projectile {
    constructor(dest, speed) {

        this.dest = dest; // position de destination {x, y}
        this.speed = speed; // vitesse de déplacement

        const imgDrop = document.createElement('img');
        imgDrop.onload = () => {
            this.imgDrop = imgDrop;

            const imgRatio = imgDrop.naturalWidth / imgDrop.naturalHeight;

            this.w = 25;
            this.h = this.w / imgRatio;
            this.x = W / 2 - this.w / 2;    //x de départ
            this.y = H - this.h - H / 12;   //y de départ

            // sens de déplacement {x,y} x = 1:droite, x = -1:gauche
            this.sens = {};
            if (this.dest.x < this.x) {
                this.sens.x = -1;
            } else {
                this.sens.x = 1;
            }
            // sens de déplacement {x,y} y = -1:haut, y = 1:bas
            if (this.dest.y < this.y) {
                this.sens.y = -1;
            } else {
                this.sens.y = 1;
            }

            this.move = {}; // pixel de déplacement
            this.dist = {}; // distance {x - x',y - y'}
            this.hypo = 0;  // Calcul de l'hypothénuse selon pythagore
        }
        imgDrop.src = "images/waterdrop.png";
    }

    draw() {
        if (!this.imgDrop) return; // if `this.imgDrop` is not loaded yet => don't draw

        this.moveProjectile();
        ctx.drawImage(this.imgDrop, this.x, this.y, this.w, this.h);
    }

    moveProjectile() {
        // calcul distance {x - x',y - y'}
        this.dist.x = Math.abs(this.x - this.dest.x);
        this.dist.y = Math.abs(this.y - this.dest.y);

        // racine carré de A² + B² (pythagore) -> donne l'hypoténuse
        this.hypo = Math.sqrt((this.dist.x * this.dist.x) + (this.dist.y * this.dist.y));

        // règle de 3 afin d'avoir le déplacement par rapport à V et hypoténuse
        this.move.x = (this.dist.x * this.speed) / this.hypo;
        this.move.y = (this.dist.y * this.speed) / this.hypo;

        // rajoute à nos coordonnées actuel le déplacement dans le bon sens
        this.x += this.move.x * this.sens.x;
        this.y += this.move.y * this.sens.y;
    };

    checkIfOut() {
        return (this.x < 0 || this.x > W || this.y < 0 || this.y > H) ? true : false;
    }

    hits(targets) {
        let initLength = targets.length;
        targets.forEach((target, idx) => {
            if (target.x + target.w > this.x &&     // droit target vs gauche projectile
                target.x < this.x + this.w &&       // gauche target vs droit projectile
                target.y + target.h > this.y &&     // bas de la target vs haut du projectile
                target.y < this.y + this.h) {       // haut de la target vs bas du projectile
                targets.splice(idx, 1);             // supp target du tableau
                splashes.push(new Splash("images/splash.svg", wImgSplash, target.x, target.y, frames));//ajout splash
                scores.push(new ScoreBox(`+${target.point + 8}`, target.x, target.y + 60, 20, frames))         //ajout score
                checkSound() ? playAudio('splash') : "";
                updateScore(target.point);
                (checkSound() && targets.length === 0) ? playAudio(bonusSound[random(0, bonusSound.length)]) : "";
                targetReached++;
                if (targets.length === 0) {
                    updateScore(20 - 8 + waveNbr * 10);
                    scores.push(new ScoreBox(`BONUS +${10 + waveNbr * 10}`, 550, 50, 30, frames))
                }
            }
        });
        return initLength > targets.length ? true : false;
    }
}