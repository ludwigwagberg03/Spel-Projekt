/// <reference path="entity.ts" />

class enemy extends entity {

    private player: Player;
    private speed: number = 4;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector,h: number, player: Player) {
        super(p, v, s, h);
        this.isgravity = false;
        console.log("enemy");

        this.player = player;
    }

    private playerPosition() {
        let direction = p5.Vector.sub(this.player.position, this.position)
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

    public onCollision(other: entity): void {
        //push enemy slightlty 

    }

    public update() {
        this.playerPosition();
        super.update();
    };

    public draw() {
        super.draw();
    };

}