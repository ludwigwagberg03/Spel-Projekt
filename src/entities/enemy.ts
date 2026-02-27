/// <reference path="entity.ts" />

class enemy extends entity {

    private player: Player;
    private speed: number = 4;
    private dashTimer: number = 1000;
    isFacingRight: boolean;
    previousPositionX: p5.Vector;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number, player: Player) {
        super(p, v, s, h);
        this.isGravity = false;
        console.log("enemy");
        this.previousPositionX = this.position;
        this.isFacingRight = true;
        this.player = player;
    }

    private followPlayer() {
        let direction = p5.Vector.sub(this.player.getPosition(), this.position)
        direction.normalize();
        direction.mult(this.speed);
        this.velocity = direction;
    }

    private updatePosition() {
        this.position.add(this.velocity);
        if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.x > width) {
            this.position.x = 0;

        }
        if (this.position.y < 0) {
            this.position.y = height;
            this.velocity.y = 0;
        }
        if (this.position.y > height) {
            this.position.y = 0;
            this.velocity.y = 0;
        }
    }

    private dash() {
            let target = this.player.getPosition();
            let direction = p5.Vector.sub(target, this.position);
            direction.normalize();
            let dashToLocation = p5.Vector.add(target, direction.mult(300))
            let dashDirection = p5.Vector.sub(dashToLocation, this.position);
            dashDirection.setMag(this.speed * 3);
            this.velocity = dashDirection;
    }

    private movementChoise() {
        let distance = p5.Vector.dist(this.position, this.player.getPosition());

        if (distance < 200 && this.dashTimer === 1000) {
            this.dash();
            this.dashTimer -= deltaTime;
        } else {
            this.followPlayer();
        }
    }

    public onCollision(other: entity): void {
        //push enemy slightlty 

    }

    public update(gravity: number, wordWidth: number) {
        if(this.position.x > this.previousPositionX.x) {
            this.isFacingRight = true;
        } else if (this.position.x < this.previousPositionX.x) {
            this.isFacingRight = false;
        }
        if (this.dashTimer < 1000){
            this.dashTimer -= deltaTime;
        }
        if (this.dashTimer <= 0) {
            this.dashTimer = 1000;
        }
        this.movementChoise();
        super.update(gravity, wordWidth);

        this.previousPositionX.x = this.position.x;
        console.log(this.dashTimer);
    };

    public draw() {
        super.draw();
    };

}