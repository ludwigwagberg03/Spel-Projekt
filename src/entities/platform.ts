/// <reference path="entity.ts" />
// console.log("create platform")
class Platform extends entity {
    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        super(p, v, s);
    }
    onCollision(other: entity): void {}
}