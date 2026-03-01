/// <reference path="entity.ts" />

class Player extends entity {
  private onGround: boolean = false;
  private onPlatform: boolean = false;
  private isFalling: boolean = false;
  public facing: number = 1;
  private shootCooldown: number = 0;

  private attackHitBox: {
    position: p5.Vector;
    width: number;
    hight: number;
  };

  private isPlayerFacingRight: boolean = true;
  private enimies: entity[] = [];
  private swordSwipeTimer: number = 500;
  private currentItem!: Item;
  public inventory: Inventory;
  private currentItemIndex: number = 0;

  constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {

    super(p, v, s, h, true);
    this.attackHitBox = {
      position: p.copy(),
      width: 100,
      hight: 50,
    }
    this.inventory = new Inventory([
      {
        id: "basicSword",
        name: "Basic Sword",
        damage: 15,
        cooldown: 500,
        hitboxWidth: 100,
        hitboxHeight: 50,
        price: 50
      }
    ]);
    this.equipItem(0);
    console.log("onwed", this.inventory.getItems());
    // console.log(this.inventory.getItems())
  }
  public canShoot(): boolean {
    return this.shootCooldown <= 0;
  }
  public setPLayerPosition(p: p5.Vector) {
    this.position = p.copy()
  }

  public setEnimies(entities: entity[]) {
    this.enimies = entities;
  }

  private equipItem(index: number) {

    console.log("onwed", this.inventory.getItems());
    const items = this.inventory.getItems();
    if (index >= 0 && index < items.length) {
      this.currentItemIndex = index;
      this.currentItem = items[index];

      this.attackHitBox.width = this.currentItem.hitboxWidth;
      this.attackHitBox.hight = this.currentItem.hitboxHeight;

      this.swordSwipeTimer = this.currentItem.cooldown;

      console.log("Equipped:", this.currentItem.name);
    }
  }
  public getCurrentIndex() {
    return this.currentItemIndex;
  }

  public onCollision(other: entity): void {
    if (other instanceof Platform) {
      this.handlePlatformLanding(other);
    }
    if (other instanceof enemy) {
      this.entityDamage(10);
    }
  }
  private handlePlatformLanding(other: entity) {
    if (this.isFalling) return;

    const platformTop = other.getPosition().y;
    const isAbovePlatform = this.position.y + this.size.y - this.velocity.y <= platformTop;

    const freeFall = this.velocity.y > 0;

    if (freeFall && isAbovePlatform) {
      this.position.y = platformTop - this.size.y;
      this.velocity.y = 0;

      this.onGround = true;
      this.onPlatform = true;
      this.isFalling = false;
    }
  }

  private takedamage(n: number): void { }

  public update(gravity: number, worldWidth: number) {
    if (this.swordSwipeTimer > 0) {
      this.swordSwipeTimer -= deltaTime;
    }
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }
    this.move();
    super.update(gravity, worldWidth);
    this.updatePosition(worldWidth);
    this.updateAttackHitBox();


  }
  draw() {
    super.draw();

    rect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.width, this.attackHitBox.hight);
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

  private updateAttackHitBox() {
    if (this.isPlayerFacingRight === true) {
      this.attackHitBox.position.x = this.position.x + this.size.x;
      this.attackHitBox.position.y = this.position.y;
    } else {
      this.attackHitBox.position.x = this.position.x - 2 * this.size.x;
      this.attackHitBox.position.y = this.position.y;
    }

  }

  private swordAttack(enemies: entity[]) {
    if (!this.currentItem) return console.log(this.swordSwipeTimer, "swordAttack exit");

    if (this.swordSwipeTimer <= 0) {
      for (let e of enemies) {
        if (e instanceof enemy) {
          // console.log("test1");

          const enemyX = e.getPosition().x;
          const enemyY = e.getPosition().y;
          const enemyWidth = e.getSize().x;
          const enemyHight = e.getSize().y;

          const attackX = this.attackHitBox.position.x;
          const attackY = this.attackHitBox.position.y;
          const attackWidth = this.attackHitBox.width;
          const attackHight = this.attackHitBox.hight;

          // console.log("Attack:", attackX, attackY, attackWidth, attackHight);
          // console.log("Enemy:", enemyX, enemyY, enemyWidth, enemyHight);

          const hit = attackX < enemyX + enemyWidth && attackX + attackWidth > enemyX && attackY < enemyY + enemyHight && attackY + attackHight > enemyY;

          if (hit) {
            // console.log("hit");
            e.entityDamage(this.currentItem.damage);
            this.swordSwipeTimer = this.currentItem.cooldown;
          }
        }
      }
    }
  }

  private move() {
    this.velocity.x = 0;

    if (keyIsDown(65)) { // a
      this.velocity.x = -5;
      this.facing = -1;
      this.isPlayerFacingRight = false;
    }
    if (keyIsDown(68)) { // d
      this.velocity.x = 5;
      this.facing = 1;
      this.isPlayerFacingRight = true;
    }
    if (keyIsDown(83) && this.onPlatform) { // s
      this.velocity.y = 0.8;
      this.onGround = false;
      this.onPlatform = false;
      this.isFalling = true;
    }
    if (keyIsDown(32)) { // space
      this.jump();
    }
    if (keyIsDown(69)) { // E
      // console.log("pressed e");
      this.swordAttack(this.enimies);
    }
    if (keyIsDown(49)) { // 1
      this.equipItem(0);
    }
    if (keyIsDown(50)) { // 2
      this.equipItem(1);
    }
    if (keyIsDown(51)) { // 3
      this.equipItem(2);
    }
    if (keyIsDown(52)) { // 4
      this.equipItem(3);
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

  // public shoot(): Projectile {
  //   this.shootCooldown = 300;

  //   let gunOffsetX = this.facing === 1 ? this.size.x : 0;
  //   let gunOffsetY = this.size.y / 2;

  //   let spawnPos = createVector(
  //     this.position.x + gunOffsetX,
  //     this.position.y + gunOffsetY,
  //   );

  //   return new Projectile(spawnPos, this.facing);
  // }
}
