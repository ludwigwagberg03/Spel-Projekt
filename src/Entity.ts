abstract class Entity {
    public position: p5.Vector;
    public velocity: p5.Vector;
    public size: p5.Vector;
    public isgravity: boolean = false;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        this.position = p;
        this.velocity = v;
        this.size = s;
        // console.log(p, v, s)
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
    
    abstract onCollision(other: Entity): void;
}