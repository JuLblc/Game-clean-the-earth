class Projectile {
    constructor() {
        console.log("creation projectile")
        const imgDrop = document.createElement('img');
        imgDrop.onload = () => {
            this.img = imgDrop;

            const imgRatio = imgDrop.naturalWidth / imgDrop.naturalHeight;
            
            this.draw();
        }
        imgDrop.src = "images/waterdrop.png"
        this.w = 100;
        this.h = 120;
        this.x = 50;
        this.y = 50;        
    }

    draw() {
        if (!this.img){
            console.log('image non chargé')
            return; // if `this.img` is not loaded yet => don't draw
        } 
        console.log(W, H, this.x, this.y, this.w, this.h);
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
}