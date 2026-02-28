/// <reference path="entity.ts" />

class Player extends entity {
  private onGround: boolean = false;
  private onPlatform: boolean = false;
  private isFalling: boolean = false;
  private shootCooldown: number = 0;
  private facing: number = 1; // 1 = right, -1 = left

  private hp: number = 100;

  private damageCooldown: number = 0;
  private damageCooldownTime: number = 60; // 1 second (60fps)

  constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {
    super(p, v, s, h, true);
  }

  public canShoot(): boolean {
    return this.shootCooldown <= 0;
  }

  public onCollision(other: entity): void {
    if (other instanceof Platform) {
      this.handlePlatformLanding(other);
    }
  }
  private handlePlatformLanding(other: entity) {
    if (this.isFalling) return;

    const platformTop = other.getPosition().y;
    const isAbovePlatform =
      this.position.y + this.size.y - this.velocity.y <= platformTop;

    const freeFall = this.velocity.y > 0;

    if (freeFall && isAbovePlatform) {
      this.position.y = platformTop - this.size.y;
      this.velocity.y = 0;

      this.onGround = true;
      this.onPlatform = true;
      this.isFalling = false;
    }
  }

  public draw(): void {
    push();

    let centerX = this.position.x + this.size.x / 2;
    let centerY = this.position.y + this.size.y / 2;

    translate(centerX, centerY);

    scale(this.facing * this.scaleEffect, this.scaleEffect);

    imageMode(CENTER);
    image(images.player, 0, 0, this.size.x, this.size.y);

    pop();
  }
  public update(gravity: number, worldWidth: number) {
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
    this.move();
    super.update(gravity, worldWidth);
    this.updatePosition(worldWidth);
  }

  private updatePosition(worldWidth: number) {
    // player is on the ground
    this.checkIfPlayerIsOnGround();

    if (this.position.x >= worldWidth - this.size.x) {
      this.velocity.x = 0;
      this.position.x = worldWidth - this.size.x;
      this.onGround = true;
      this.isFalling = false;
    }
    if (this.position.x < 0) {
      this.velocity.x = 0;
      this.position.x = 0;
      this.onGround = true;
      this.isFalling = false;
    }
    // damage cooldown
    if (this.damageCooldown > 0) {
      this.damageCooldown--;
    }
  }
  public getHp(): number {
    return this.hp;
  }
  private checkIfPlayerIsOnGround() {
    if (this.position.y > height - this.size.y) {
      this.velocity.y = 0;
      this.position.y = height - this.size.y;
      this.onGround = true;
      this.onPlatform = false;
      this.isFalling = false;
    }
  }

  public takeDamage(amount: number): void {
    if (this.damageCooldown > 0) return;
    console.log("Player took damage!");

    this.hp -= amount;
    this.damageCooldown = this.damageCooldownTime;

    if (this.hp < 0) this.hp = 0;
  }
  private move() {
    this.velocity.x = 0;

    let moving = false;

    if (keyIsDown(65)) {
      // A
      this.velocity.x = -5;
      this.facing = -1;
      moving = true;
    }

    if (keyIsDown(68)) {
      // D
      this.velocity.x = 5;
      this.facing = 1;
      moving = true;
    }

    if (keyIsDown(83) && this.onPlatform) {
      this.velocity.y = 0.8;
      this.onGround = false;
      this.onPlatform = false;
      this.isFalling = true;
    }

    if (keyIsDown(32)) {
      this.jump();
    }

    if (keyIsDown(75)) {
      this.entityDamage(3.33);
    }
  }
  private jump() {
    if (this.onGround) {
      this.velocity.y = -30;
      this.onGround = false;
      this.onPlatform = false;
    }
  }

  public shoot(target: p5.Vector): Projectile {
    this.shootCooldown = 300;

    // True center
    let spawnPos = this.getCenter();

    // Direction
    let direction = p5.Vector.sub(target, spawnPos);
    direction.normalize();

    // Face enemy FIRST
    if (direction.x >= 0) {
      this.facing = 1;
    } else {
      this.facing = -1;
    }

    // Move bullet to FRONT of player
    const gunOffsetX = this.size.x * 0.6;
    spawnPos.x += this.facing * gunOffsetX;

    // Small vertical adjustment to align with gun 
    spawnPos.y -= 10;

    // Recoil
    this.velocity.add(direction.copy().mult(-3));

    let damageValue = floor(random(1, 4));

    return new Projectile(spawnPos, direction, damageValue);
  }
}
