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
