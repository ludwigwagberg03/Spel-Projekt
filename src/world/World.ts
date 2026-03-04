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
    public draw(cameraX: number) {
        this.drawStage(this.backGround1, cameraX, this.firstImageSpeed, height);
        this.drawStage(this.backGround2, cameraX, this.secondImageSpeed, height * 0.6);
        this.drawStage(this.backGround3, cameraX, this.thirdImageSpeed, height * 0.3);
    }
    private drawStage(img: p5.Image, cameraX: number, speed: number, imageHeight: number) {
        push();

        for (let x = -img.width; x < width + img.width; x += img.width) {
            image(img, x - cameraX * speed % img.width, height - imageHeight, img.width, imageHeight);
        } 
        pop();
    }
}
