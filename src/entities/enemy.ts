/// <reference path="entity.ts" />

class enemy extends entity {
  private player: Player;
  private speed: number = 4;
  private knockbackForce: p5.Vector = createVector(0, 0);
  private dashTimer: number = 2500;
  isFacingRight: boolean;
  previousPositionX: p5.Vector;
  dashTimerValue: number;
  dashAmount: number;
  dashColdownTimer: number = 10000;
  protected positionA: number;
  protected positionB: number;
  private goingToA: boolean = true;
  // Death State System
  private isDying: boolean = false;
  private deathTimer: number = 0;
  private fadeAlpha: number = 255;
  private shrinkScale: number = 1;
  private deathTriggeredOnce: boolean = false;
  private shootTimer: number = 3000;
  private timeSinceLastShot: number = 0;

  constructor(p: p5.Vector, v: p5.Vector, s: p5.Vector, h: number, player: Player) {
    super(p, v, s, h);
    this.isGravity = false;
    console.log("enemy");
    this.previousPositionX = this.position;
    this.isFacingRight = true;
    this.player = player;
    this.dashTimerValue = this.dashTimer
    this.dashAmount = 0;
    this.positionA = 0;
    this.positionB = 0;
  }

  private tryIceGun(deltaTime: number, level: Level){
    this.timeSinceLastShot += deltaTime;
    console.log("gun coldown",this.timeSinceLastShot);
    let target = this.player.getCenter();
    let distance = p5.Vector.dist(this.position, target);

    if(distance < 600 && this.timeSinceLastShot >= this.shootTimer){
      this.iceShooter(target, level);
      this.timeSinceLastShot = 0;
    }
  }

  public iceShooter(target: p5.Vector, level: Level){
    let startPositon = this.getCenter();
    let ice = new IceBoulder(startPositon.copy(), target.copy(), 5);

    level.addProjectile(ice);
  }

  private followPlayer() {
    let direction = p5.Vector.sub(this.player.getPosition(), this.position)
    direction.normalize();
    direction.mult(this.speed);
    this.velocity = direction;
  }


  private dash() {
    let target = this.player.getPosition();
    let distance = p5.Vector.dist(this.position, target);

    if (distance < 10) {
      return;
    }

    let direction = p5.Vector.sub(target, this.position);
    direction.normalize();

    let dashToLocation = p5.Vector.add(target, direction.mult(500))
    let dashDirection = p5.Vector.sub(dashToLocation, this.position);

    dashDirection.setMag(this.speed * 4.2);
    this.velocity = dashDirection;
  }

  private hover() {
    let hoverDistance = this.player.getPosition().y;
    hoverDistance = hoverDistance - 250;
    let playerX = this.player.getPosition().x;

    let hoverRange = 200;
    let minX = playerX - hoverRange;
    let maxX = playerX + hoverRange;

    playerX = random(minX, maxX);

    if (this.positionA === 0) {
      this.positionA = random(minX, maxX);
      this.positionB = random(minX, maxX);
    }

    this.positionA = constrain(this.positionA, minX, maxX);
    this.positionB = constrain(this.positionB, minX, maxX);

    let targetX = this.goingToA ? this.positionA : this.positionB;

    if (abs(this.position.x - targetX) < 10) {
      this.goingToA = !this.goingToA;

      if (this.goingToA === true) {
        this.positionA = 0;
        this.positionB = 0;
      }
    }

    let target = createVector(targetX, hoverDistance);

    let direction = p5.Vector.sub(target, this.position);
    direction.setMag(this.speed);
    this.velocity = direction;
  }

  private movementChoise() {
    let distance = p5.Vector.dist(this.position, this.player.getPosition());
    // && this.dashTimer === 1000
    if (distance < 400) {
      if (this.dashTimer === this.dashTimerValue && this.dashAmount <= 3) {
        this.dash();
        this.dashAmount++;
      } if (this.dashAmount > 3) {
        console.log("else follows player?");
        setTimeout(() => this.followPlayer(), 200);
        this.hover();
      }
      this.dashTimer -= deltaTime;
    } else {
      console.log("follows player");
      this.followPlayer()
    }
  }

  // --- Start Death ---
  private startDeath(): void {
    this.isDying = true;
    this.deathTriggeredOnce = true;
    this.velocity.mult(0);
    this.knockbackForce.mult(0);
  }

  // --- Death Animation ---
  private handleDeath(): void {
    this.deathTimer++;

    this.shrinkScale -= 0.04; // shrink
    this.fadeAlpha -= 10; // fade

    if (this.shrinkScale < 0) this.shrinkScale = 0;
    if (this.fadeAlpha < 0) this.fadeAlpha = 0;

    if (this.deathTimer > 25) {
      this.isDead = true; // safe removal
    }
  }

  public onCollision(other: entity): void {
    //push enemy slightlty
  }
  public entityDamage(damage: number, hitFrom?: p5.Vector) {
    if (this.isDying) return; // dying

    super.entityDamage(damage, hitFrom);

    // knockback
    if (hitFrom) {
      let force = p5.Vector.sub(this.position, hitFrom);
      force.normalize();
      force.mult(8);
      this.knockbackForce = force;
    }

    // trigger animated death
    if (this.health <= 0) {
      this.startDeath();
    }
  }
  //
  public consumeDeathTrigger(): boolean {
    if (this.deathTriggeredOnce) {
      this.deathTriggeredOnce = false;
      return true;
    }
    return false;
  }

  public getCenter(): p5.Vector {
    return createVector(
      this.position.x + this.size.x / 2,
      this.position.y + this.size.y / 2,
    );
  }

  public update(gravity: number, wordWidth: number, level?: Level) {
    super.update(gravity, wordWidth);
    if (this.isDying) {
      this.handleDeath();
      return;
    }

    if (this.dashAmount > 3) {
      this.dashColdownTimer -= deltaTime;
    }
    if (this.dashColdownTimer <= 0) {
      this.dashAmount = 0;
      this.dashColdownTimer = 10000;
    }
    if (this.dashTimer < this.dashTimerValue) {
      this.dashTimer -= deltaTime;
    }
    if (this.dashTimer <= 0) {
      this.dashTimer = this.dashTimerValue;
    }
    //this.movementChoise();
    //this.hover();

    this.position.add(this.knockbackForce);
    this.knockbackForce.mult(0.85);
    
    if(level){
      this.tryIceGun(this.deathTimer, level)
    }

    this.previousPositionX.x = this.position.x;
    //console.log("Delay: ", this.dashTimer);
    //console.log("Amount: ", this.dashAmount);
    //console.log("Coldown: ", this.dashColdownTimer);
  };

  public draw() {
    super.draw();
    push();

    let centerX = this.position.x + this.size.x / 2;
    let centerY = this.position.y + this.size.y / 2;

    translate(centerX, centerY);
    scale(this.scaleEffect);

    // Body
    let alpha = 255;

    if (this.isDying) alpha = this.fadeAlpha;

    if (this.hitFlash > 0) {
      fill(255, 50, 50, alpha);
    } else {
      fill(120, 0, 200, alpha);
    }

    // dying shrink
    const s = this.isDying ? this.shrinkScale : 1;
    scale(s);

    ellipse(0, 0, this.size.x, this.size.y);

    // Eyes
    fill(255);
    ellipse(-10, -5, 8);
    ellipse(10, -5, 8);

    pop();

    //  Health Bar
    let healthPercent = this.health / this.maxHealth;

    push();
    noStroke();
    fill(50);
    rect(this.position.x, this.position.y - 15, this.size.x, 6);

    fill(0, 255, 0);
    rect(this.position.x, this.position.y - 15, this.size.x * healthPercent, 6);
    pop();
  }
}
