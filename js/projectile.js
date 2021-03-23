class Projectile {
    constructor(dest, speed) {

        console.log("creation projectile");

        this.dest = dest; // position de destination {x, y}
        this.speed = speed; // vitesse de déplacement 


        const imgDrop = document.createElement('img');
        imgDrop.onload = () => {
            this.img = imgDrop;

            const imgRatio = imgDrop.naturalWidth / imgDrop.naturalHeight;

            this.w = 25;
            this.h = this.w / imgRatio;
            this.x = W / 2 - this.w / 2;    //x de départ
            this.y = H - this.h - 100;      //y de départ 

            // position actuelle {x, y}, ici de départ
            this.ac = {};
            this.ac.x = this.x;
            this.ac.y = this.y;

            // sens de déplacement {x,y} x = 1 => vers le droite, x = -1 vers la gauche
            this.sens = {};
            if (this.dest.x < this.x) {
                this.sens.x = -1;
            } else { // gestion du cas où = ?
                this.sens.x = 1;
            }
            // sens de déplacement {x,y} y = -1 => vers le haut, y=1 vers le bas
            if (this.dest.y < this.y) {
                this.sens.y = -1;
            } else { // gestion du cas où = ?
                this.sens.y = 1;
            }

            this.move = {}; // pixel de déplacement
            this.dist = {}; // distance {x - x',y - y'}
            this.hypo = 0;  // Calcul de l'hypothénuse selon pythagore

            console.log("creation projectile", "ac:", this.ac, "dest:", this.dest, "speed:", this.speed, "sens:", this.sens);
        }
        imgDrop.src = "images/waterdrop.png";
    }

    draw() {
        if (!this.img) {
            console.log('image non chargé')
            return; // if `this.img` is not loaded yet => don't draw
        }

        console.log("dessin projectile", "x:", this.ac.x, "y:", this.ac.y);
        console.log(this.moveObject());        
        ctx.drawImage(this.img, this.ac.x, this.ac.y, this.w, this.h);
        
    }

    moveObject() {
        // move = { x: 1, y: 1 }

        // calcul distance {x - x',y - y'}
        this.dist.x = Math.abs(this.ac.x - this.dest.x);
        this.dist.y = Math.abs(this.ac.y - this.dest.y);

        // racine carré de A² + B² (pythagore) -> donne l'hypoténuse
        this.hypo = Math.sqrt((this.dist.x * this.dist.x) + (this.dist.y * this.dist.y));

        // règle des tiers afin d'avoir le déplacement par rapport à V et hypoténuse
        this.move.x = (this.dist.x * this.speed) / this.hypo;
        this.move.y = (this.dist.y * this.speed) / this.hypo;

        // rajoute à nos coordonnées actuel le déplacement dans le bon sens
        this.ac.x += this.move.x * this.sens.x;
        this.ac.y += this.move.y * this.sens.y;

        // retourne si l'objet est arrivé à son objectif -Vpx=marge d'erreur-
        return (this.dist.x <= this.speed && this.dist.y <= this.speed) ? true : false;
    };

}