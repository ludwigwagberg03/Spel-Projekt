/// <reference path="../../systems/ParticlesAndCoins.ts" />
class Level implements IScreen {
  private game: Game;
  private entities: entity[];
  private gravity = 0.8;
  private player: Player;
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
  private coinCount: number = 0;

  // ===== victory state =====
  private victoryActive: boolean = false;
  private victoryTimer: number = 0;
  private victoryZoom: number = 1;

  // ===== lose lock =====
  private gameOverTriggered: boolean = false;

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

  constructor(game: Game) {
    this.game = game;

    this.entities = [];

    this.entities.push(
      new Platform(
        createVector(0, height / 2),
        createVector(0, 0),
        createVector(this.worldWidth, 10),
      ),
    );

    this.player = new Player(
      createVector(this.worldWidth / 2, height / 2),

      createVector(0, 0),
      createVector(50, 100),
      100,
    );

    this.entities.push(this.player);

    this.entities.push(
      new enemy(
        createVector(this.worldWidth / 2 - 30, height / 2),
        createVector(0, 0),
        createVector(50, 100),
        100,
        this.player,
      ),
    );
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
    text(`Coins: ${this.coinCount}`, 65, 47);

    pop();
  }
  update(): void {
    // Follow player with camera
    this.cameraX = this.player.getPosition().x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.worldWidth - width);

    // Update all entities (player, enemies, platforms)
    this.entities.forEach((entity) => {
      entity.update(this.gravity, this.worldWidth);
    });

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
    const playerCenter = this.player.getPosition().copy();
    playerCenter.add(createVector(25, 50)); // rough center

    const groundY = height - 20; // simple floor
    this.coins.forEach((c) => {
      c.update(this.gravity, groundY);

      if (c.tryCollect(playerCenter)) {
        this.coinCount += 1;
        sounds.coin.play();
      }
    });
    this.coins = this.coins.filter((c) => !c.isCollected);

    // =========================
    // LOSE CONDITION -> GameOverScreen
    // =========================
    if (!this.gameOverTriggered && !this.player.alive) {
      this.gameOverTriggered = true;
      this.game.changeScreen(new GameOverScreen(this.game, false));
      return;
    }

    // =========================
    // WIN CONDITION (last enemy removed)
    // =========================
    const enemiesLeft = this.entities.some((x) => x instanceof enemy);

    if (!this.victoryActive && !enemiesLeft) {
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
        if (entity !== this.player && projectile.overlaps(entity)) {
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

    translate(-this.cameraX + shakeX, shakeY);

    // image(images.testStage, 0, 0);
    // =========================
    // PARALLAX BACKGROUND
    // =========================
    const baseY = 0;

    // far layer (slow)
    for (let x = 0; x < this.worldWidth; x += images.treasury.width) {
      image(images.treasury, x - this.cameraX * 0.2, baseY);
    }

    // mid layer
    for (let x = 0; x < this.worldWidth; x += images.pirate.width) {
      image(images.pirate, x - this.cameraX * 0.45, baseY + 80);
    }

    // main stage layer (fast / gameplay ground)
    for (let x = 0; x < this.worldWidth; x += images.testStage.width) {
      image(images.testStage, x - this.cameraX * 1.0, baseY);
    }

    // Draw entities
    this.entities.forEach((entity) => {
      entity.draw();
    });

    // Draw projectiles
    this.projectiles.forEach((projectile) => {
      projectile.draw();
    });
    // Draw explosion particles
    this.particles.forEach((p) => p.draw());

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
    pop(); // end camera

    // =========================
    // UI (screen space)
    // =========================
    this.drawCoinUI();

    // Victory overlay
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
      text("Press R to restart", width / 2, height / 2 + 25);

      pop();
    }

    // // UI text (screen space)
    // fill(255, 55, 99);
    // textAlign(CENTER, CENTER);
    // textSize(48);
    // text("PLAYING", width / 2, height / 4);

    // textSize(18);
    // text("Press ESC to pause", width / 2, height / 4 + 60);
  }

  public keyPressed(code: number): void {
    // R = restart
    if (code === 82) {
      this.game.changeScreen(new Level(this.game));
      return;
    }
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new PauseScreen(this.game));
    }
    if (code === 74) {
      // J key
      if (!this.player.canShoot()) return;

      let enemyTarget = this.findClosestEnemy();

      if (!enemyTarget) return;

      const bullet = this.player.shoot(enemyTarget);
      this.addProjectile(bullet);

      sounds.shoot.play();
    }
  }
}