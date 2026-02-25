// ================================
// Particles + Coins
// ================================

class ExplosionParticle {
  public pos: p5.Vector;
  public vel: p5.Vector;
  public life: number;
  private size: number;

  constructor(spawn: p5.Vector) {
    this.pos = spawn.copy();
    this.vel = p5.Vector.random2D().mult(random(1.5, 6));
    this.life = 350; // ms
    this.size = random(3, 8);
  }

  update(): void {
    this.life -= deltaTime;

    // little gravity
    this.vel.y += 0.12;

    // move
    this.pos.add(this.vel);

    // slow down
    this.vel.mult(0.92);
  }
  draw(): void {
    if (this.life <= 0) return;

    push();
    noStroke();

    const a = map(this.life, 0, 350, 0, 200);
    fill(255, 170, 60, a);

    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }

  get alive(): boolean {
    return this.life > 0;
  }
}

class CoinDrop {
  public pos: p5.Vector;
  private vel: p5.Vector;
  private radius: number = 10;
  private collected: boolean = false;

  constructor(spawn: p5.Vector) {
    this.pos = spawn.copy();
    this.vel = createVector(random(-3, 3), random(-10, -5));
  }
  update(gravity: number, groundY: number): void {
    if (this.collected) return;

    // gravity
    this.vel.y += gravity * 0.6;

    // move
    this.pos.add(this.vel);

    // ground bounce
    if (this.pos.y + this.radius > groundY) {
      this.pos.y = groundY - this.radius;
      this.vel.y *= -0.45; // bounce
      this.vel.x *= 0.75; // friction
    }
  }

  draw(): void {
    if (this.collected) return;

    push();
    noStroke();

    // glow
    fill(255, 210, 80, 80);
    ellipse(this.pos.x, this.pos.y, this.radius * 2.2);

    // coin
    fill(255, 205, 60);
    ellipse(this.pos.x, this.pos.y, this.radius * 2);

    // inner shine
    fill(255, 240, 180, 160);
    ellipse(this.pos.x - 3, this.pos.y - 3, this.radius);

    pop();
  }

  tryCollect(playerPos: p5.Vector): boolean {
    if (this.collected) return false;

    const d = dist(this.pos.x, this.pos.y, playerPos.x, playerPos.y);
    if (d < 80) {
      this.collected = true;
      return true;
    }
    return false;
  }

  get isCollected(): boolean {
    return this.collected;
  }
}
