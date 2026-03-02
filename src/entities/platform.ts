/// <reference path="entity.ts" />
// console.log("create platform")
class Platform extends entity {
    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        super(p, v, s);
        console.log("platform");
    }
    onCollision(other: entity): void {}

    draw(){
        push();
        fill(255, 50, 50);
        rect(5760, 10, 5760);
        pop();
    }
}