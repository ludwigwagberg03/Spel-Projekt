/// <reference path="entity.ts" />

class Player extends entity {
  private onGround: boolean = false;
  private onPlatform: boolean = false;
  private isFalling: boolean = false;
  public facing: number = 1;
  private shootCooldown: number = 0;
  private attackHitBox: { position: p5.Vector; width: number; hight: number; };
  private isPlayerFacingRight: boolean = true;
  private enimies: entity[] = [];
  private swordSwipeTimer: number = 500;
  private currentItem!: Item;
  public inventory: Inventory;
  private currentItemIndex: number = 0;
  private effectType: string = "";
  private effectTimer: number = 0;
  private baseSpeed: number = 1;
  private speed: number = 1;
  private currentImage: p5.Image;
  private frameIndex: number = 0;
  private frameTimer: number = 0;
  private frameDelay: number = 2500;
  private totalFrames: number = 6; // default idle
  private frameWidth: number = 16;
  private frameHeight: number = 32;
  public coinCount: number = 0;

  constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number) {

    super(p, v, s, h, true);
    this.currentImage = images.playerIdle;
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
        type: "melee",
        cooldown: 500,
        hitboxWidth: 100,
        hitboxHeight: 50,
        price: 50
      },
      {
        id: "pistol",
        name: "Pistol",
        type: "ranged",
        damage: 50,
        cooldown: 300,
        projectileSpeed: 15,
        projectileSize: 80,
        price: 0
      }
    ]);
    this.equipItem(0);
    // console.log("onwed", this.inventory.getItems());
  }

  public isAutoFireOn(): boolean {
    if(!this.currentItem) return false;
    return this.currentItem.autoFire === true;
  }

  public getCurrentIndex() {
    return this.currentItemIndex;
  }

  public setPLayerPosition(p: p5.Vector) {
    this.position = p.copy()
  }

  public setEnimies(entities: entity[]) {
    this.enimies = entities;
  }

  public onCollision(other: entity): void {
    if (other instanceof Platform) {
      this.handlePlatformLanding(other);
    }
    if (other instanceof enemy) {
      this.entityDamage(1);
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
    this.updateEffect(deltaTime);
    this.updateAnimation();

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

  public updateEffect(deltaTime: number) {
    if (this.effectTimer > 0) {
      this.effectTimer -= deltaTime;
      // console.log("effect timer ", this.effectTimer);
      if (this.effectTimer <= 0) {
        this.clearEffect();
      } else {
        this.proccessEffect();
      }
    }
  }

  private proccessEffect() {
    switch (this.effectType) {
      //logic for effects like firedamage
    }
  }

  private clearEffect() {
    this.effectTimer = 0;
    this.effectType = "";

    this.speed = this.baseSpeed;
  }

  private updateAnimation() {

    let newImage = this.currentImage;
    let newTotalFrames = this.totalFrames;

    if (!this.onGround) {
      if (this.velocity.y < 0) {
        newImage = images.playerJump;
        newTotalFrames = 14;
        this.frameDelay = 1000;
      } else {
        newImage = images.playerAir;
        newTotalFrames = 10;
      }
    }
    else if (this.velocity.x !== 0) {
      //console.log("walking");
      newImage = images.playerWalk;
      newTotalFrames = 4;
      this.frameDelay = 8000;
    }
    else {
      newImage = images.playerIdle;
      newTotalFrames = 5;
      this.frameDelay = 2000;
    }

    if (newImage !== this.currentImage) {
      this.frameIndex = 0;
      this.frameTimer = 0;
    }

    this.currentImage = newImage;
    this.totalFrames = newTotalFrames;

    this.frameTimer += deltaTime;

    if (this.frameTimer > this.frameDelay) {
      this.frameIndex++;
      this.frameTimer = 0;

      if (this.frameIndex >= this.totalFrames) {
        this.frameIndex = 0;
      }
    }
  }

  private equipItem(index: number) {

    console.log("onwed", this.inventory.getItems());
    const items = this.inventory.getItems();

    if (index >= 0 && index < items.length) {

      this.currentItemIndex = index;
      this.currentItem = items[index];

      if (this.currentItem.type === "melee") {
        this.attackHitBox.width = this.currentItem.hitboxWidth!;
        this.attackHitBox.hight = this.currentItem.hitboxHeight!;
      }
      this.swordSwipeTimer = this.currentItem.cooldown;

      console.log("Equipped:", this.currentItem.name);
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
  public attack(target: p5.Vector): Projectile | null {
    if (this.shootCooldown > 0) return null;
    if (!this.currentItem) return null;

    if (this.currentItem.type === "melee") {
      this.swordAttack(this.enimies);
      return null;
    }

    if (this.currentItem.type === "ranged") {
      const projectile = this.createProjectile(target);
      this.shootCooldown = this.currentItem.cooldown;
      return projectile;
    }
    return null;
  }

  private createProjectile(target: p5.Vector): Projectile {
    let spawnPos = this.getPosition().copy();
    spawnPos.add(createVector(this.size.x / 2, this.size.y / 2));

    let direction = p5.Vector.sub(target, spawnPos);
    direction.normalize();
    // direction.mult(this.currentItem.projectileSpeed!)

    this.velocity.add(direction.copy().mult(-3));

    return new Projectile(
      spawnPos,
      direction,
      this.currentItem.damage,
      this.currentItem.projectileSize!,
      this,
    );
  }

  // public canShoot(): boolean {
  //   return this.shootCooldown <= 0;
  // }

  public tryShoot(mouseWorldPos: p5.Vector): Projectile | null {
    // if (!this.canShoot()) return null;

    return this.attack(mouseWorldPos);
  }

  private move() {
    this.velocity.x = 0;

    if (keyIsDown(65)) { // a
      this.velocity.x = -5 * this.speed;
      this.facing = -1;
      this.isPlayerFacingRight = false;
    }
    if (keyIsDown(68)) { // d
      this.velocity.x = 5 * this.speed;
      this.facing = 1;
      this.isPlayerFacingRight = true;
    }
    if (keyIsDown(83) && this.onPlatform) { // s
      this.velocity.y = 0.8 * this.speed;
      this.onGround = false;
      this.onPlatform = false;
      this.isFalling = true;
    }
    if (keyIsDown(32)) { // space
      this.jump();
    }
    if (keyIsDown(69)) { // E
      this.swordAttack(this.enimies);
      this.applyEffect("slow", 10000);
      console.log("effect timer ", this.effectTimer);
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
    if (keyIsDown(53)) { // 5
      this.equipItem(4);
    }
    if (keyIsDown(54)) { // 6
      this.equipItem(5);
    }
  }
  public applyEffect(type: string, duration: number) {
    this.effectType = type;
    this.effectTimer = duration;

    switch (type) {
      case "slow":
        this.speed = this.baseSpeed / 2;
        break;
    }
    // add more effect like firedamage
  }

  private jump() {
    if (this.onGround) {
      this.velocity.y = -30 * this.speed;
      this.onGround = false;
      this.onPlatform = false;
    }
  }
  draw(cameraX: number) {
    super.draw(cameraX);
    noSmooth();

    const sx = this.frameIndex * this.frameWidth;
    const sy = 0;

    const mouseWorld = createVector(mouseX + cameraX, mouseY)

    if (mouseWorld) {
      //console.log("drawing");
      //console.log(images.smgAim);
      const dx = mouseWorld.x - (this.position.x + this.size.x / 2);
      const dy = mouseWorld.y - (this.position.y + this.size.y / 2);
      const angel = atan2(dy, dx);

      const frameWidth = images.smgAim.width / 3;
      const frameHeight = images.smgAim.height;

      let weaponAim = 0;
      if (angel < -PI / 6) {
        weaponAim = frameWidth * 1;
      } else if (angel > PI / 6) {
        weaponAim = frameWidth * 2;
      }
      const weaponScale = 1;
      image(
        images.smgAim,
        this.position.x,
        this.position.y + this.size.y / 2 - frameHeight / weaponScale / 2,
        this.size.x * weaponScale,
        this.size.y * weaponScale,
        weaponAim,
        0,
        frameWidth, frameHeight
      );
    }

    image(
      this.currentImage,
      this.position.x,
      this.position.y,
      this.size.x,
      this.size.y,
      sx,
      sy,
      this.frameWidth,
      this.frameHeight
    );
    push();
    noFill();
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(this.position.x, this.position.y, this.size.x, this.size.y);
    pop();
    //rect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.width, this.attackHitBox.hight);
  }
}
