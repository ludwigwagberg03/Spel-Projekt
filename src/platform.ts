class Platform extends Entity {
    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector) {
        super(p, v, s);
        console.log("platform");
    }
    update() {

    }
    draw() {
        // console.log("draw platform")
        
        push();
        fill(255, 204, 0);
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
        pop();
    }
    keyPressed(): void {

    }
}