/// <reference path="entity.ts" />
/// <reference path="enemy.ts" />
/// <reference path="platform.ts" />

class Projectile extends entity {
  private speed: number = 12;
  private direction: number;
  public isAlive: boolean = true;
  private damage: number = 1;

  constructor(pos: p5.Vector, dir: number) {
    super(pos.copy(), createVector(dir * 12, 0), createVector(20, 8), 1);

    this.direction = dir;
    this.isgravity = false;
  }

  update() {
    this.updateposition();

    // Remove if outside screen
    if (this.position.x > width || this.position.x < 0) {
      this.isAlive = false;
    }
  }

  draw() {
    fill(255, 200, 0);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
  }

  onCollision(other: entity) {
    if (other instanceof Enemy) {
      other.takeDamage(this.damage);
      this.isAlive = false;
    }

    if (other instanceof Platform) {
      this.isAlive = false;
    }
  }
}
