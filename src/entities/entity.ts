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
  protected scaleEffect: number = 1;

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

  public entityDamage(damage: number, hitFrom?: p5.Vector) {
    this.scaleEffect = 1.3;
    if (this.timer === 1000) {
      this.hitFlash = 150;
      this.health -= damage;

      // Knockback away from hit source
      if (hitFrom) {
        let force = p5.Vector.sub(this.position, hitFrom);
        force.normalize();
        force.mult(6);
        this.velocity.add(force);
      }

      if (this.health <= 0) {
        this.die();
      }

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
    if (this.scaleEffect > 1) {
      this.scaleEffect -= 0.02;
    }

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

    translate(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2,
    );

    scale(this.scaleEffect);

    if (this.hitFlash > 0) {
      fill(255, 50, 50);
      stroke(255);
      strokeWeight(3);
    } else {
      fill(63);
      noStroke();
    }

    rect(-this.size.x / 2, -this.size.y / 2, this.size.x, this.size.y);

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
  public getIsAlive(): boolean {
    return this.isAlive;
  }

  abstract onCollision(other: entity): void;
}
