/// <reference path="Entity.ts" />

class Enemy extends Entity {

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        super(p, v, s);
        this.isgravity = true;
        console.log("enemy");

    }

    onCollision(other: Entity): void {
        //
    }

    update() {
        //
    };

    draw() {
        super.draw();
    };

}