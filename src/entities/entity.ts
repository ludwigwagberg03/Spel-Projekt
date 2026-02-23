abstract class entity {
    public position: p5.Vector;
    public velocity: p5.Vector;
    public size: p5.Vector;
    public isgravity: boolean = false;
    private health: number;
    private isAlive: boolean = true;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number = 0) {
        this.position = p;
        this.velocity = v;
        this.size = s;
        // console.log(p, v, s)
        this.health = h;
    }

    entityDamage(damage: number){
        this.health -= damage;

        if (this.health <= 0){
            this.die()
        }
    }

    protected die() {
        this.isAlive = false
    }

    get lifeStatus(): boolean {
        return this.health > 0;
    }

    public update() {
        this.position.add(this.velocity);
        // this.position.add(this.velocity.copy().mult(deltaTime));
    }
    
    public draw() {
        push();
        fill(255);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }

    // public overlaps(other: Entity) {
    //     return false;
    // }
    
    abstract onCollision(other: entity): void;
}