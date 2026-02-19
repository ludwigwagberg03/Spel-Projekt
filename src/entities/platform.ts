/// <reference path="entity.ts" />

class Platform extends entity {
    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        super(p, v, s);
        console.log("platform");
    }

    onCollision(other: entity): void {}
}