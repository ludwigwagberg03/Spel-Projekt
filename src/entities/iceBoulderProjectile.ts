/// <reference path="projectile.ts" />

class IceBoulder extends Projectile{
    constructor(p: p5.Vector, t: p5.Vector, d: number){
        super(p,t,d);
    }

    onCollision(other: entity): void {
        super.onCollision(other);

        if (other instanceof Player){
            (other as Player).applyEffect("slow", 7500);
        }
    }
    draw() {
        push();
        fill(100, 150, 255);
        noStroke();
        ellipse(this.position.x, this.position.y, 100);
        fill(180,220,255,100);
        ellipse(this.position.x, this.position.y, 80);
        pop();
    }
}