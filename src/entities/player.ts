/// <reference path="entity.ts" />

class Player extends entity {
  private onGround: boolean = false;
  private onPlatform: boolean = false;
  private isFalling: boolean = false;
  public facing: number = 1;
  private shootCooldown: number = 0;

  private maxHp: number = 100;
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

  private takedamage(n: number): void {}

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

    if (keyIsDown(65)) {
      // a
      this.velocity.x = -5;
      this.facing = -1;
    }
    if (keyIsDown(68)) {
      // d
      this.velocity.x = 5;
      this.facing = 1;
    }
    if (keyIsDown(83) && this.onPlatform) {
      // s
      this.velocity.y = 0.8;
      this.onGround = false;
      this.onPlatform = false;
      this.isFalling = true;
    }
    if (keyIsDown(32)) {
      // space
      this.jump();
    }
    if (keyIsDown(75)) {
      // k
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
    // Reset cooldown
    this.shootCooldown = 300;

    // Spawn position (center of player)
    let spawnPos = this.getPosition().copy();
    spawnPos.add(createVector(this.size.x / 2, this.size.y / 2));

    // Calculate direction
    let direction = p5.Vector.sub(target, spawnPos);
    direction.normalize();

    // Recoil
    this.velocity.add(direction.copy().mult(-3));

    // Random damage (1–3)
    let damageValue = floor(random(1, 4));

    return new Projectile(spawnPos, target, damageValue);
  }
}
