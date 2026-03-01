/// <reference path="projectile.ts" />

class IceBoulder extends Projectile{
    constructor(p: p5.Vector, t: p5.Vector, d: number){
        super(p,t,d);
    }

    onCollision(other: entity): void {
        super.onCollision(other);

        if (other instanceof Player){
            
        }
    }

}