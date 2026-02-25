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

}
