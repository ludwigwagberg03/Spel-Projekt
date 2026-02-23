abstract class entity {
    public position: p5.Vector;
    public velocity: p5.Vector;
    public size: p5.Vector;
    public isgravity: boolean = false;
    private health: number;
    private isAlive: boolean = true;
    private notPlayedSound: boolean = true;
    private timer: number = 1000;

    constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number = 0) {
        this.position = p;
        this.velocity = v;
        this.size = s;
        // console.log(p, v, s)
        this.health = h;
    }

    entityDamage(damage: number){
        

        if (this.timer === 1000) {
            this.timer -= deltaTime;
            console.log(this.timer);
            this.health -= damage;
            //console.log(this.health);
            if (this.health <= 0){
                this.die();
            }

            
            console.log("play sound");
            sounds.tick.play();
            
        }
    }

    protected die() {
        this.isAlive = false
    }

    get lifeStatus(): boolean {
        return this.health > 0;
    }

    healthPool(): number {
        return this.health;
    }

    public update() {
        if (this.timer < 1000) {
            this.timer -= deltaTime
            console.log(this.timer);
        }
        if (this.timer < 0) {
            this.timer = 1000
            console.log(this.timer);
        }
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