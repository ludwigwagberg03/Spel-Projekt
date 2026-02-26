/// <reference path="entity.ts" />

class Player extends entity {
    private onGround: boolean = false;
    private onPlatform: boolean = false;
    private isFalling: boolean = false;
    private currentImage: p5.Image;
    private frameIndex: number = 0;
    private frameTimer: number = 0;
    private frameDelay: number = 2500;
    private totalFrames: number = 6; // default idle
    private frameWidth: number = 16;
    private frameHeight: number = 32;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {
    super(p, v, s, h, true);

    this.currentImage = images.playerIdle;
}

private updateAnimation() {

    let newImage = this.currentImage;
    let newTotalFrames = this.totalFrames;

    if (!this.onGround) {
        if (this.velocity.y < 0) {
            newImage = images.playerJump;
            newTotalFrames = 14;
            this.frameDelay = 1000;
        } else {
            newImage = images.playerAir;
            newTotalFrames = 10;
        }
    }
    else if (this.velocity.x !== 0) {
        console.log("walking");
        newImage = images.playerWalk;
        newTotalFrames = 4;
        this.frameDelay = 8000;
    }
    else {
        newImage = images.playerIdle;
        newTotalFrames = 5;
        this.frameDelay = 2000;
    }

    if (newImage !== this.currentImage) {
        this.frameIndex = 0;
        this.frameTimer = 0;
    }

    this.currentImage = newImage;
    this.totalFrames = newTotalFrames;

    this.frameTimer += deltaTime;

    if (this.frameTimer > this.frameDelay) {
        this.frameIndex++;
        this.frameTimer = 0;

        if (this.frameIndex >= this.totalFrames) {
            this.frameIndex = 0;
        }
    }
}

    public draw() {
        //console.log("drawing player", this.currentImage, this.currentImage?.width);
    noSmooth();

    const sx = this.frameIndex * this.frameWidth;
    const sy = 0;

    image(
        this.currentImage,
        this.position.x,
        this.position.y,
        this.size.x,
        this.size.y,
        sx,
        sy,
        this.frameWidth,
        this.frameHeight
    );
}

    public onCollision(other: entity): void {
        if (other instanceof Platform) {
            this.handlePlatformLanding(other);
        }
    }
    private handlePlatformLanding(other: entity) {
        if (this.isFalling) return;

        const platformTop = other.getPosition().y;
        const isAbovePlatform = this.position.y + this.size.y - this.velocity.y <= platformTop;

        const freeFall = this.velocity.y > 0;

        if (freeFall && isAbovePlatform) {
            this.position.y = platformTop - this.size.y;
            this.velocity.y = 0;

            this.onGround = true;
            this.onPlatform = true;
            this.isFalling = false;
        }
    }

    private takedamage(n: number): void { }

    public update(gravity: number, worldWidth: number) {
    this.move();
    super.update(gravity, worldWidth);
    this.updatePosition(worldWidth);
    this.updateAnimation();
}

    private updatePosition(worldWidth: number) {

        // player is on the ground 
        this.checkIfPlayerIsOnGround();

        if (this.position.x >= worldWidth - this.size.x) {
            this.velocity.x = 0;
            this.position.x = worldWidth - this.size.x;
            this.onGround = true;
            this.isFalling = false;
        }
        if (this.position.x < 0) {
            this.velocity.x = 0;
            this.position.x = 0;
            this.onGround = true;
            this.isFalling = false;
        }
    }
    private checkIfPlayerIsOnGround() {
        if (this.position.y > height - this.size.y) {
            this.velocity.y = 0;
            this.position.y = height - this.size.y;
            this.onGround = true;
            this.onPlatform = false;
            this.isFalling = false;
        }
    }
    private move() {
        this.velocity.x = 0;

        if (keyIsDown(65)) { // a
            this.velocity.x = -5;
        }
        if (keyIsDown(68)) { // d
            this.velocity.x = 5;
        }
        if (keyIsDown(83) && this.onPlatform) { // s
            this.velocity.y = 0.8;
            this.onGround = false;
            this.onPlatform = false;
            this.isFalling = true;
        }
        if (keyIsDown(32)) { // space
            this.jump();
        }
        if (keyIsDown(75)) { // k
            this.entityDamage(3.33);
        }
    }
    private jump() {
        if (this.onGround) {
            this.velocity.y = -30;
            this.onGround = false;
            this.onPlatform = false;
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
