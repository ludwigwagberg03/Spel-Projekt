/// <reference path="entity.ts" />

class enemy extends entity {
  private player: Player;
  private speed: number = 4;

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

  private updatePosition() {
    this.position.add(this.velocity);
    if (this.position.x < 0) {
      this.position.x = width;
    }
    if (this.position.x > width) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = height;
      this.velocity.y = 0;
    }
    if (this.position.y > height) {
      this.position.y = 0;
      this.velocity.y = 0;
    }
  }

  public onCollision(other: entity): void {
    //push enemy slightlty
  }

  public update(gravity: number, wordWidth: number) {
    this.playerPosition();
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