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

class ScoreBox {
    constructor(text,x, y,size,frame){
        this.text = text;
        this.x = x;
        this.y = y;
        this.size = size;
        this.frame = frame;
    }

    draw(){
        ctx.font = `900 ${this.size}px Roboto`;
        ctx.fillStyle = "#E50513";
        ctx.globalAlpha = 0.6;
        ctx.fillText(this.text, this.x, this.y);
        ctx.globalAlpha = 1;
    }
}