class Objet {
    constructor(src, w , x, y) {
        const imgObj = document.createElement('img');
        imgObj.onload = () => {
            this.imgObj = imgObj;

            const imgRatio = imgObj.naturalWidth / imgObj.naturalHeight;
            this.w = w;
            this.h = this.w / imgRatio;
            this.x = x;
            this.y = y;
        }
        imgObj.src = src;
    }

    draw() {
        if (!this.imgObj) {
            console.log('image Obj non chargée');
            return; // if `this.imgDrop` is not loaded yet => don't draw
        }
        // console.log("dessin projectile", "x:", this.ac.x, "y:", this.ac.y);
        ctx.drawImage(this.imgObj, this.x, this.y, this.w, this.h);
    }
}