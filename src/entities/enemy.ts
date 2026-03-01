/// <reference path="entity.ts" />

class enemy extends entity {

    private player: Player;
    private speed: number = 4;
    private dashTimer: number = 2500;
    isFacingRight: boolean;
    previousPositionX: p5.Vector;
    dashTimerValue: number;
    dashAmount: number;
    dashColdownTimer: number = 10000;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number, player: Player) {
        super(p, v, s, h);
        this.isGravity = false;
        console.log("enemy");
        this.previousPositionX = this.position;
        this.isFacingRight = true;
        this.player = player;
        this.dashTimerValue = this.dashTimer
        this.dashAmount = 0;
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
            let distance = p5.Vector.dist(this.position, target);

            if(distance < 10){
                return;
            }

            let direction = p5.Vector.sub(target, this.position);
            direction.normalize();

            let dashToLocation = p5.Vector.add(target, direction.mult(500))
            let dashDirection = p5.Vector.sub(dashToLocation, this.position);

            dashDirection.setMag(this.speed * 4.2);
            this.velocity = dashDirection;
    }

    private hover() {
            let hoverDistance = this.player.getPosition().y;
            hoverDistance = hoverDistance - 250;
            let targetX = this.player.getPosition().x;

            let hoverRange = 200;
            let minX = targetX - hoverRange;
            let maxX = targetX + hoverRange;

            targetX = random(minX,maxX);
            
            let target = createVector(targetX, hoverDistance);

            let direction = p5.Vector.sub(target, this.position);
            direction.normalize();
            direction.mult(this.speed);
            this.velocity = direction;
    }

    private movementChoise() {
        let distance = p5.Vector.dist(this.position, this.player.getPosition());
        // && this.dashTimer === 1000
        if (distance < 400) {
            if (this.dashTimer === this.dashTimerValue && this.dashAmount <= 3){
                this.dash();
                this.dashAmount++;
            }if (this.dashAmount > 3) {
                console.log("else follows player?");
                this.followPlayer();
            }
            this.dashTimer -= deltaTime;
        } else {
            console.log("follows player");
            this.followPlayer();
        }
    }

    public onCollision(other: entity): void {
        //push enemy slightlty 

    }

    public update(gravity: number, wordWidth: number) {
        if (this.dashAmount > 3){
            this.dashColdownTimer -= deltaTime;
        }
        if (this.dashColdownTimer <= 0){
            this.dashAmount = 0;
            this.dashColdownTimer = 10000;
        }
        if (this.dashTimer < this.dashTimerValue){
            this.dashTimer -= deltaTime;
        }
        if (this.dashTimer <= 0) {
            this.dashTimer = this.dashTimerValue;
        }
        //this.movementChoise();
        this.hover();
        super.update(gravity, wordWidth);

        this.previousPositionX.x = this.position.x;
        console.log("Delay: ",this.dashTimer);
        console.log("Amount: ",this.dashAmount);
        console.log("Coldown: ", this.dashColdownTimer);
    };

    public draw() {
        super.draw();
    };

}