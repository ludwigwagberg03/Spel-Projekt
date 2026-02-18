import { Entity } from "./Entity";

export class Player extends Entity {
    onGround: boolean = false;
    onPlatform: boolean = false;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        super(p, v, s);
        this.isgravity = true;
        console.log("player");
    }
    onCollision(other: Entity): void {
        const platformTop = other.position.y;
        // console.log("RIO")
        this.position.y = platformTop - this.size.y;
        this.velocity.y = 0;
        this.onGround = true;
        this.onPlatform = true;
    }
    update() {
        this.updateposition();
        this.move();
        // this.checkIfJumping();
    }
    updateposition() {
        this.position.add(this.velocity);
        // console.log("onGround", this.onGround, "onPlatform", this.onPlatform)
        if (this.position.y > height - this.size.y) {
            this.velocity.y = 0;
            this.position.y = height - this.size.y;
            this.onGround = true;
            this.onPlatform = false;
        }
    }
    get ignorePlatform(): boolean {
        return this.onPlatform
    }
    private move() {
        this.velocity.x = 0;

        if (keyIsDown(65)) { // a
            // console.log("move")
            this.velocity.x = -5;
        }
        if (keyIsDown(68)) { // d
            // console.log("move")
            this.velocity.x = 5;
        }
        if (keyIsDown(83) && this.onPlatform) { // s
            this.velocity.y = 0.8;
            this.onGround = false;
            this.onPlatform = false;
        }
    }
    jump() { // space
        if (this.onGround) {
            this.velocity.y = -30;
            this.onGround = false;
            this.onPlatform = false;
        }
    }
    keyPressed(): void {
        if (keyCode === 32) {
            // console.log("jump")
            this.jump();
        }
        // console.log("on screen Play")
    }
    draw() {
        // console.log("player", this.position.y, height - this.size / 2, this.size)
        push();
        fill(255);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }
}