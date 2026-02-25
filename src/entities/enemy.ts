/// <reference path="entity.ts" />

class enemy extends entity {
  private player: Player;
  private speed: number = 4;
  private knockbackForce: p5.Vector = createVector(0, 0);

  constructor(
    p: p5.Vector,
    v: p5.Vector,
    s: p5.Vector,
    h: number,
    player: Player,
  ) {
    super(p, v, s, h);
    this.isGravity = false;
    console.log("enemy");

    this.player = player;
  }

  private playerPosition() {
    let direction = p5.Vector.sub(this.player.getPosition(), this.position);
    direction.normalize();
    direction.mult(this.speed);
    this.velocity = direction;
  }

  public onCollision(other: entity): void {
    //push enemy slightlty
  }
  public entityDamage(damage: number, hitFrom?: p5.Vector) {
    super.entityDamage(damage, hitFrom);

    if (hitFrom) {
      let force = p5.Vector.sub(this.position, hitFrom);
      force.normalize();
      force.mult(8);

      this.knockbackForce = force;
    }
  }

  public update(gravity: number, wordWidth: number) {
    // Normal chasing movement
    this.playerPosition();

    // Apply knockback separately
    this.position.add(this.knockbackForce);

    // Slowly reduce knockback (friction)
    this.knockbackForce.mult(0.85);

    super.update(gravity, wordWidth);
  }

  public draw() {
    push();

    let centerX = this.position.x + this.size.x / 2;
    let centerY = this.position.y + this.size.y / 2;

    translate(centerX, centerY);
    scale(this.scaleEffect);

    // Body
    if (this.hitFlash > 0) {
      fill(255, 50, 50);
    } else {
      fill(120, 0, 200);
    }

    ellipse(0, 0, this.size.x, this.size.y);

    // Eyes
    fill(255);
    ellipse(-10, -5, 8);
    ellipse(10, -5, 8);

    pop();

    //  Health Bar (draw outside scaling)
    let healthPercent = this.health / 100;

    push();
    noStroke();
    fill(50);
    rect(this.position.x, this.position.y - 15, this.size.x, 6);

    fill(0, 255, 0);
    rect(this.position.x, this.position.y - 15, this.size.x * healthPercent, 6);
    pop();
  }
}
