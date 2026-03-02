/// <reference path="entity.ts" />
/// <reference path="enemy.ts" />
/// <reference path="platform.ts" />

class Projectile extends entity {
  private speed: number = 12;

  private damage: number = 1;
  constructor(pos: p5.Vector, direction: p5.Vector, damage: number) {
    super(pos, direction.copy().mult(12), createVector(10, 10), 0);
    this.damage = damage;
  }

  // constructor(pos: p5.Vector, target: p5.Vector, damage: number) {
  //   const speed = 12; // local constant

  //   let direction = p5.Vector.sub(target, pos);
  //   direction.normalize();
  //   direction.mult(speed);

  //   super(pos.copy(), direction, createVector(12, 12), 1);
  //   this.damage = damage;

  //   this.isGravity = false;
  // }

  public update(gravity: number, worldWidth: number) {
    super.update(gravity, worldWidth);

    if (this.position.x > worldWidth || this.position.x < 0) {
      this.isAlive = false;
    }
  }

  draw() {
    push();

    fill(255, 220, 100);
    noStroke();
    ellipse(this.position.x, this.position.y, 12);

    fill(255, 255, 180);
    ellipse(this.position.x, this.position.y, 6);
    pop();
  }

  onCollision(other: entity) {
    if (other instanceof enemy) {
      (other as enemy).entityDamage(this.damage, this.position.copy());

      sounds.confirm.play(); // impact sound

      this.isAlive = false;
    }

    if (other instanceof Platform) {
      this.isAlive = false;
    }
  }
}
