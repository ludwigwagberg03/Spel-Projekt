abstract class entity {
    protected position: p5.Vector;
    protected velocity: p5.Vector;
    protected size: p5.Vector;
    private isGravity: boolean;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, g = false) {
        this.position = p;
        this.velocity = v;
        this.size = s;
        this.isGravity = g;
        // console.log(p, v, s)
    }

    public getPosition() {
        return this.position.copy();
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
        fill(63);
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