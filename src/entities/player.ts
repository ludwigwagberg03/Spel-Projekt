/// <reference path="entity.ts" />

class Player extends entity {
    onGround: boolean = false;
    onPlatform: boolean = false;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {
        super(p, v, s, h);
        this.isgravity = true;
        console.log("player");

    }
    onCollision(other: entity): void {

        //console.log(this.onPlatform)
        const platformTop = other.position.y;
        if (this.onPlatform) {

            //console.log("RIO")
            const isAbovePlatform = this.position.y + this.size.y - this.velocity.y <= platformTop;

            const freeFall = this.velocity.y > 0;

            if (freeFall && isAbovePlatform) {
                this.position.y = platformTop - this.size.y;
                this.velocity.y = 0;
                this.onGround = true;
                this.onPlatform = true;
            }
        }
    }

    private takedamage(n: number): void { }

    update() {
        this.move();
        this.updateposition();
        // this.checkIfJumping();
        super.update();
    }
    updateposition() {
        // console.log("onGround", this.onGround, "onPlatform", this.onPlatform)
        if (this.position.y > height - this.size.y) {
            this.velocity.y = 0;
            this.position.y = height - this.size.y;
            this.onGround = true;
            this.onPlatform = false;
        }
    }
    // get ignorePlatform(): boolean {
    //     return this.onPlatform
    // }
    private move() {
        // console.log("on platform", this.onPlatform)
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
            //console.log("pressed s", this.onPlatform)
        }
        if (keyIsDown(32)) { // space
            this.jump();
        }
        if (keyIsDown(75)) { // k
            this.entityDamage(3.33);
        }
    }
    private jump() { // space
        if (this.onGround) {
            this.velocity.y = -30;
            this.onGround = false;
            this.onPlatform = true;
        }
    }

    // public overlaps(other: Entity) {
    //     if (other instanceof Platform) {
    //         // Speciell lösning
    //     } else {
    //         super.overlaps(other);
    //     }
    // }
}