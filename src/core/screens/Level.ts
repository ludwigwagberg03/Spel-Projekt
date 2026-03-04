/// <reference path="../../systems/ParticlesAndCoins.ts" />
class Level implements IScreen {
  private game: IChangableScreen;
  private entities: entity[];
  private gravity = 0.8;
  private player: Player;
  private enemy?: enemy;
  private world: World;
  private cameraX: number = 0;
  private worldWidth = 5760; // 1920 * 3
  // Stores all active projectiles
  private projectiles: Projectile[] = [];
  private impacts: { pos: p5.Vector; life: number }[] = [];
  private damageNumbers: { pos: p5.Vector; value: number; life: number }[] = [];
  private shakeTime: number = 0;
  private shakeStrength: number = 0;

  // ===== particles + coins =====
  private particles: ExplosionParticle[] = [];
  private coins: CoinDrop[] = [];

  // ===== victory state =====
  private victoryActive: boolean = false;
  private victoryTimer: number = 0;
  private victoryZoom: number = 1;

  // ===== lose lock =====
  private gameOverTriggered: boolean = false;

  private isFiring: boolean = false;
  private bossActive: boolean = false;
  private bossSpawnDelay: number = 15000;
  private bossSpawnTimer: number = 0;
  private diffieculty: number = 1;
  private baseBossHealth: number = 100;
  private baseBossSpeed: number = 4;
  private currentBoss: enemy | null = null;
  private coinStandard: number = 100;
  private levelStartTime: number = 0;
  private bossStartTime: number = 0;

  constructor(game: IChangableScreen, _player: Player) {
    this.game = game;
    this.entities = [];

    this.entities.push(
      new Platform(
        createVector(0, height / 2),
        createVector(0, 0),
        createVector(this.worldWidth, 10),
      ),
    );

    //  create fresh player
    this.player = new Player(
      createVector(this.worldWidth / 2, height / 2),
      createVector(0, 0),
      createVector(64, 64),
      100,
    );

    this.entities.push(this.player);

    this.player.setEnimies(this.entities);

    this.world = new World(
      images.firstBackgournd,
      images.secondBackgroudn,
      images.thirdBackground
    );
  }

  private drawBossIcon(){
    if(!this.currentBoss || !this.currentBoss.alive) return;

    const bossPosition = this.currentBoss.getCenter();
    const screenX = bossPosition.x - this.cameraX;
    const screenY = bossPosition.y;

    const onScreen = screenX > 0 && screenX < width && screenY > 0 && screenY < height;

    if(onScreen) return;

    const screenCenter = createVector(width/2, height/2);
    const direction = createVector(screenX,screenY).sub(screenCenter);
    direction.normalize();
    const margin = 10;
    const iconPosition = p5.Vector.add(screenCenter,direction.mult(Math.min(width,height)/ 2 - margin));

    push();
    translate(iconPosition.x, direction.x);
    const angle = atan2(direction.y, direction.x);
    rotate(angle);

    fill(122,199,227); // actual boss color
    noStroke();

    circle(30,30,50);
    textAlign(CENTER, TOP);
    textSize(16);
    fill(255);
    text("Boss",30,55);
    pop();
  }

  private BossSystem() {
    if (!this.bossActive) {
      this.bossSpawnTimer += deltaTime;

      if (this.bossSpawnTimer >= this.bossSpawnDelay) {
        this.bossSpawn();
        this.bossSpawnTimer = 0;
      }
    }

    if (this.bossActive && this.currentBoss) {
      if (!this.currentBoss.alive) {
        this.diffieculty++;
        this.bossActive = false;
        this.currentBoss = null;
      }
    }
  }

  private bossSpawn() {
    const scaledHealth = this.baseBossHealth * this.diffieculty;
    const scaledSpeed = this.baseBossSpeed * this.diffieculty;

    const boss = new enemy(
      createVector(this.worldWidth / 2 - 30, height / 2 - 100),
      createVector(0, 0),
      createVector(256, 256),
      scaledHealth,
      this.player
    );

    boss.setSpeed(scaledSpeed);

    this.entities.push(boss);

    this.currentBoss = boss;
    this.bossActive = true;
  }

  public mousePressed() {
    this.isFiring = true;
  }
  public mouseReleased() {
    this.isFiring = false;
  }

  public addProjectile(p: Projectile) {
    this.projectiles.push(p);
  }

  public triggerImpact(pos: p5.Vector) {
    this.impacts.push({
      pos: pos.copy(),
      life: 200,
    });
  }

  public spawnDamageNumber(pos: p5.Vector, value: number) {
    this.damageNumbers.push({
      pos: pos.copy(),
      value: value,
      life: 800,
    });
  }

  private spawnExplosion(pos: p5.Vector): void {
    for (let i = 0; i < 18; i++) {
      this.particles.push(new ExplosionParticle(pos));
    }
  }

  private spawnCoins(pos: p5.Vector): void {
    const amount = floor(random(3, 7));
    for (let i = 0; i < amount; i++) {
      this.coins.push(new CoinDrop(pos));
    }
  }
  
  private drawCoinUI(): void {
    // UI
    push();
    textFont(gameFont);

    // panel
    noStroke();
    fill(0, 0, 0, 120);
    rect(20, 20, 180, 55, 12);

    // coin icon
    fill(255, 205, 60);
    ellipse(45, 47, 22);

    // text
    fill(255);
    textSize(18);
    textAlign(LEFT, CENTER);
    text(`Coins: ${this.player.coinCount}`, 65, 47);

    pop();
  }
  update(): void {
    console.log("diffieculty",this.diffieculty);
    this.BossSystem();
    if (this.isFiring) {
      let worldMouse = createVector(mouseX + this.cameraX, mouseY);
      const bullet = this.player.tryShoot(worldMouse);
      if (bullet) {
        this.addProjectile(bullet);
        sounds.shoot.play();
      }
    }

    // Follow player with camera
    this.cameraX = this.player.getPosition().x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.worldWidth - width);

    // Update all entities (player, enemies, platforms)
    this.entities.forEach((entity) => {
      if (entity instanceof enemy) {
        entity.update(this.gravity, this.worldWidth, this);
      } else {
        entity.update(this.gravity, this.worldWidth);
      }
    });

    for (let projectile of this.projectiles) {
      if (projectile.overlaps(this.player)) {
        // console.log("Player kolliderar med testprojektil!");
      }
    }

    // Update all active projectiles
    this.projectiles.forEach((projectile) => {
      projectile.update(this.gravity, this.worldWidth);
    });

    // Check collisions between objects
    this.checkCollision();
    // =========================
    // ENEMY DEATH EVENTS + REMOVE DEAD
    // =========================
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const e = this.entities[i];

      if (e instanceof enemy) {
        // If death just started: spawn explosion + coins ONCE
        if (e.consumeDeathTrigger()) {
          console.log("spawn coins");
          const center = e.getCenter();
          this.spawnExplosion(center);
          this.spawnCoins(center);
        }

        // If fully finished dying -> remove from entities
        if (e.isDead) {
          this.entities.splice(i, 1);
        }
      }
    }

    // =========================
    // UPDATE PARTICLES
    // =========================
    this.particles.forEach((p) => p.update());
    this.particles = this.particles.filter((p) => p.alive);

    // =========================
    // UPDATE COINS + COLLECT
    // =========================
    const playerCenter = this.player.getCenter();

    const groundY = height / 2; //platform is created at y = height / 2
    this.coins.forEach((c) => {
      c.update(this.gravity, groundY);

      if (c.tryCollect(playerCenter)) {
        this.player.coinCount += 1;
        sounds.coin.play();
      }
    });
    this.coins = this.coins.filter((c) => !c.isCollected);

    // =========================
    // LOSE CONDITION -> GameOverScreen
    // =========================
    if (!this.gameOverTriggered && !this.player.alive) {
      this.gameOverTriggered = true;
      this.game.changeScreen(new GameOverScreen(this.game, this.gameOverTriggered, this.player));
      return;
    }

    // =========================
    // WIN CONDITION (last enemy removed)
    // =========================
    const enemiesLeft = this.entities.some((x) => x instanceof enemy);

    const coinsStillOnGround = this.coins.length > 0;

    if (!this.victoryActive && !enemiesLeft && !coinsStillOnGround && this.currentBoss === null && this.diffieculty > 1) {
      this.victoryActive = true;
      this.victoryTimer = 0;
    }

    if (this.victoryActive) {
      this.victoryTimer += deltaTime;

      // smooth zoom in
      this.victoryZoom = lerp(this.victoryZoom, 1.18, 0.05);
    }

    // Remove projectiles that are no longer alive
    this.projectiles = this.projectiles.filter((p) => p.getIsAlive());

    this.impacts.forEach((i) => (i.life -= deltaTime));
    this.impacts = this.impacts.filter((i) => i.life > 0);
    if (this.shakeTime > 0) {
      this.shakeTime -= deltaTime;
    }
    this.damageNumbers.forEach((d) => {
      d.life -= deltaTime;
      d.pos.y -= 0.5; // float upward
    });

    this.damageNumbers = this.damageNumbers.filter((d) => d.life > 0);

    this.entities = this.entities.filter((isDead) => !isDead.isItDead());
  }
  //
  private findClosestEnemy(): p5.Vector | null {
    let closest: enemy | null = null;
    let minDist = Infinity;

    for (let e of this.entities) {
      if (e instanceof enemy && e.alive) {
        let d = p5.Vector.dist(this.player.getPosition(), e.getPosition());

        if (d < minDist) {
          minDist = d;
          closest = e;
        }
      }
    }
    return closest ? closest.getPosition() : null;
  }
  checkCollision() {
    // ENTITY vs ENTITY
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        if (this.entities[i].overlaps(this.entities[j])) {
          this.entities[i].onCollision(this.entities[j]);
          this.entities[j].onCollision(this.entities[i]);
        }
      }
    }

    // PROJECTILE vs ENTITY
    for (let projectile of this.projectiles) {
      for (let entity of this.entities) {
        if (projectile.overlaps(entity)) {
          projectile.onCollision(entity);
          entity.onCollision(projectile);

          // ONLY when hitting enemy
          if (entity instanceof enemy) {
            // impact effect
            this.triggerImpact(projectile.getPosition().copy());
            // damage value
            let isCrit = random() < 0.2; // 20% chance
            let damageValue = isCrit ? 5 : floor(random(1, 4));
            this.spawnDamageNumber(
              projectile.getPosition().copy(),
              damageValue,
            );

            //screen shake
            this.shakeTime = 150;
            this.shakeStrength = 6;
          }
        }
      }
    }
  }

  public keyPressed(code: number): void {
    // R = restart
    // if (code === 82) {
    //   this.game.changeScreen(new Level(this.game, this.player));
    //   return;
    // }
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new PauseScreen(this.game, this.player, this));
    }
    if (code === 66 && this.currentBoss === null) { // B
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new ShopScreen(this.game, this.player, this));
    }
  }

  draw(): void {
    push();

    // Victory zoom (camera + world will zoom)
    if (this.victoryActive) {
      translate(width / 2, height / 2);
      scale(this.victoryZoom);
      translate(-width / 2, -height / 2);
    }

    let shakeX = 0;
    let shakeY = 0;

    if (this.shakeTime > 0) {
      shakeX = random(-this.shakeStrength, this.shakeStrength);
      shakeY = random(-this.shakeStrength, this.shakeStrength);
    }
    this.world.draw(this.cameraX)
    // =========================
    // BACKGROUND (scrolling world)
    // =========================
    translate(-this.cameraX + shakeX, shakeY);

    // Draw entities
    this.entities.forEach((entity) => {
      entity.draw(this.cameraX);
    });

    // Draw projectiles
    this.projectiles.forEach((projectile) => {
      projectile.draw(this.cameraX);
    });
    // Draw explosion particles
    this.particles.forEach((p) => p.draw());
    pop();

    this.player.drawHealthBar(width - 400, 20, 350, 50);
    //this.player.draw(createVector(mouseX + this.cameraX, mouseY));
    // Boss countdown
    if(!this.bossActive){
      const timeLeft = this.bossSpawnDelay - this.bossSpawnTimer;
      const seconds = Math.max(0, Math.ceil(timeLeft/1000));
      fill(255);
      textAlign(CENTER,CENTER);
      textSize(32);

      text("Boss spawns in " + seconds, width / 2, 100);
    }

    // Draw coins
    this.coins.forEach((c) => c.draw());

    // Draw impacts INSIDE camera
    this.impacts.forEach((i) => {
      push();

      textAlign(CENTER, CENTER);
      fill(255, 150, 0, i.life);

      let size = map(i.life, 0, 200, 20, 60);
      textSize(size);

      text("💥", i.pos.x, i.pos.y);

      pop();
    });
    // Draw floating damage numbers
    this.damageNumbers.forEach((d) => {
      push();

      textAlign(CENTER, CENTER);

      // First calculate size
      let size = map(d.life, 0, 800, 20, 40);

      if (d.value >= 5) {
        fill(255, 220, 0, d.life / 3); // yellow crit
        textSize(size + 10);
      } else {
        fill(255, 50, 50, d.life / 3);
        textSize(size);
      }

      text(d.value.toString(), d.pos.x, d.pos.y);

      pop();
    });
    // end camera
    this.drawBossIcon();
    // =========================
    // UI (screen space)
    // =========================
    this.drawCoinUI();
    this.drawVictoryOverlay();
    this.drawInventory();
  }
  private drawVictoryOverlay() {
    if (this.victoryActive) {
      push();
      textFont(gameFont);
      textAlign(CENTER, CENTER);

      fill(0, 0, 0, 160);
      rect(width / 2 - 260, height / 2 - 120, 520, 220, 18);

      fill(255);
      textSize(34);
      text("VICTORY!", width / 2, height / 2 - 40);

      textSize(18);
      text("Press B to enter shop", width / 2, height / 2 + 25);

      pop();
    }
  }
  private drawInventory() {
    push();
    textAlign(LEFT, TOP);
    textSize(10);

    const items = this.player.inventory.getItems();

    const left = 200;
    const top = 40;
    const spacingBetweenItems = 80;

    const slotWidth = 70;
    const slotHeight = 20;

    for (let i = 0; i < items.length; i++) {
      const x = left + i * spacingBetweenItems;
      const y = top;

      stroke(255);
      strokeWeight(2);

      if (i === this.player.getCurrentIndex()) {
        let glow = 180 + sin(frameCount * 0.08) * 70;
        stroke(255, 220, 120, glow);
      }

      noFill();
      rect(x, y, slotWidth, slotHeight);

      noStroke();
      fill(255);
      text(items[i].name, x + 5, y + 5);
    }
    pop();
  }
  onEnter(): void {
    this.levelStartTime = millis();
    // console.log("level screen entered");
  }
}
