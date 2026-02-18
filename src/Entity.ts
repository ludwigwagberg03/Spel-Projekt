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
    abstract update(): void;
    abstract draw(): void;
    abstract keyPressed(): void;
    onCollision(other: Entity): void {}
    private takedamage(n: number): void {}
}