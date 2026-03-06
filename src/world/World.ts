class World {
    private firstImageSpeed: number = 0.2;
    private secondImageSpeed: number = 0.5;
    private thirdImageSpeed: number = 1;
    private backGround1!: p5.Image;
    private backGround2!: p5.Image;
    private backGround3!: p5.Image;

    constructor(backGround1: p5.Image, backGround2: p5.Image, backGround3: p5.Image) {
        this.backGround1 = backGround1;
        this.backGround2 = backGround2;
        this.backGround3 = backGround3;
    }
    public draw(cameraX: number, cameraY: number) {
        this.drawStage(this.backGround1, cameraX, 0, this.firstImageSpeed, height);
        this.drawStage(this.backGround2, cameraX, cameraY, this.secondImageSpeed, height * 0.6);
        this.drawStage(this.backGround3, cameraX, cameraY, this.thirdImageSpeed, height * 0.3);
    }
    private drawStage(img: p5.Image, cameraX: number,cameraY: number, speed: number, imageHeight: number) {
        push();

        let y = height - imageHeight - cameraY;

        for (let x = -img.width; x < width + img.width; x += img.width) {
            image(img, x - (cameraX * speed % img.width), y , img.width, imageHeight);
        } 
        pop();
    }
}
