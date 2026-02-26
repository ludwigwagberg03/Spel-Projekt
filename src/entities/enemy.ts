/// <reference path="entity.ts" />

class enemy extends entity {

    private player: Player;
    private speed: number = 4;
    private dashTimer: number = 5000;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number, player: Player) {
        super(p, v, s, h);
        this.isGravity = false;
        console.log("enemy");

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
        let target = this.player.getPosition().mult(2);
        let direction = p5.Vector.sub(this.position, target);
        //direction.mult(this.speed * 2);
        this.velocity = direction;
    }

    private movementChoise() {
        let distance = p5.Vector.dist(this.position, this.player.getPosition());

        if (distance < 200) {
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
        if (this.dashTimer < 5000){
            this.dashTimer -= deltaTime;
        }
        if (this.dashTimer <= 0) {
            this.dashTimer = 5000;
        }
        this.movementChoise();
        super.update(gravity, wordWidth);
    };

    public draw() {
        super.draw();
    };

}