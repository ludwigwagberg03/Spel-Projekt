abstract class entity {
    public position: p5.Vector;
    public velocity: p5.Vector;
    public size: p5.Vector;
    private isGravity: boolean;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, g = false) {
        this.position = p;
        this.velocity = v;
        this.size = s;
        this.isGravity = g;
        // console.log(p, v, s)
    }
    
    public update(gravity: number, worldWidth: number) {
        this.position.add(this.velocity);
        // this.position.add(this.velocity.copy().mult(deltaTime));
        this.applyGravity(gravity)
    }

    private applyGravity(gravity: number): void {
      if (this.isGravity) {
        this.velocity.y += gravity;
      }
    }
    
    public draw() {
        push();
        fill(255);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }

    public overlaps(other: entity) {
        return (
            this.position.x < other.position.x + other.size.x &&
            this.position.x + this.size.x > other.position.x &&
            this.position.y < other.position.y + other.size.y &&
            this.position.y + this.size.y > other.position.y 
        );
    }
    
    abstract onCollision(other: entity): void;
}