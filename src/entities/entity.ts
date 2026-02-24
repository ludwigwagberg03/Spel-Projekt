abstract class entity {
  protected position: p5.Vector;
  protected velocity: p5.Vector;
  protected size: p5.Vector;
  protected isGravity: boolean;
  protected hitFlash: number = 0;

  protected health: number;
  protected isAlive: boolean = true;
  private notPlayedSound: boolean = true;
  protected timer: number = 1000;

  constructor(
    p: p5.Vector,
    v: p5.Vector,
    s: p5.Vector,
    h: number = 0,
    g = false,
  ) {
    this.position = p;
    this.velocity = v;
    this.size = s;
    this.health = h;
    this.isGravity = g;
  }

 public entityDamage(damage: number) {
    if (this.timer === 1000) {
        this.hitFlash = 120;
      this.timer -= deltaTime;
      console.log(this.timer);
      this.health -= damage;
      //console.log(this.health);
      if (this.health <= 0) {
        this.die();
      }
      console.log("play sound");
      sounds.tick.play();
    }
  }

  protected die() {
    this.isAlive = false;
  }

  get lifeStatus(): boolean {
    return this.health > 0;
  }

  public get alive(): boolean {
    return this.isAlive;
  }

  healthPool(): number {
    return this.health;
  }

  public getPosition() {
    return this.position.copy();
  }

  public update(gravity: number, worldWidth: number) {
    if (this.hitFlash > 0) {
      this.hitFlash -= deltaTime;
    }

    if (this.timer < 1000) {
      this.timer -= deltaTime;
      console.log(this.timer);
    }
    if (this.timer < 0) {
      this.timer = 1000;
      console.log(this.timer);
    }
    this.position.add(this.velocity);
    // this.position.add(this.velocity.copy().mult(deltaTime));
    this.applyGravity(gravity);
  }

  private applyGravity(gravity: number): void {
    if (this.isGravity) {
      this.velocity.y += gravity;
    }
  }

  public draw() {
    push();
    // fill(63);
    if (this.hitFlash > 0) {
      fill(255, 0, 0); // red
    } else {
      fill(63);
    }

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
