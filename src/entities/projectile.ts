/// <reference path="entity.ts" />
/// <reference path="enemy.ts" />
/// <reference path="platform.ts" />

class Projectile extends entity {
  private speed: number = 12;
  private direction: number;

  private damage: number = 1;

  constructor(pos: p5.Vector, dir: number) {
    super(pos.copy(), createVector(dir * 12, 0), createVector(20, 8), 1);

    this.direction = dir;
    this.isGravity = false;
  }

  public update(gravity: number, worldWidth: number) {
    super.update(gravity, worldWidth);

    if (this.position.x > width || this.position.x < 0) {
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
      (other as enemy).entityDamage(this.damage);

      sounds.confirm.play(); // impact sound

      this.isAlive = false;
    }

    if (other instanceof Platform) {
      this.isAlive = false;
    }
  }
}
