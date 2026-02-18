abstract class Entity {
    position: p5.Vector;
    velocity: p5.Vector;
    size: p5.Vector;
    isgravity: boolean = false;

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
    
    abstract onCollision(other: Entity): void;
}