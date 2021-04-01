class Objet {
    constructor(src, w, x, y) {
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
        if (!this.imgObj) return; // if `this.imgDrop` is not loaded yet => don't draw
        ctx.drawImage(this.imgObj, this.x, this.y, this.w, this.h);
    }
}

class Splash extends Objet {
    constructor(src, w, x, y, frame) {
        super(src, w, x, y);
        this.frame = frame;
    }
}