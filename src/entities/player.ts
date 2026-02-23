/// <reference path="entity.ts" />

class Player extends entity {
    private onGround: boolean = false;
    private onPlatform: boolean = false;
    private isFalling: boolean = false;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {
        super(p, v, s, h, true);
    }
    
    public onCollision(other: entity): void {
        if (other instanceof Platform) {

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
    }

    private takedamage(n: number): void { }

    public update(gravity: number, worldWidth: number) {
        this.move();
        super.update(gravity, worldWidth)
        this.updatePosition(worldWidth);
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
