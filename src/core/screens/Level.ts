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

  public addProjectile(p: Projectile) {
    this.projectiles.push(p);
  }
  public triggerImpact(pos: p5.Vector) {
    this.impacts.push({
      pos: pos.copy(),
      life: 200,
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

    // Remove projectiles that are no longer alive
   this.projectiles = this.projectiles.filter((p) => p.getIsAlive());

    this.impacts.forEach((i) => (i.life -= deltaTime));
    this.impacts = this.impacts.filter((i) => i.life > 0);
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

          if (entity instanceof enemy) {
            this.triggerImpact(projectile.getPosition().copy());
          }
        }
      }
    }
  }

  draw(): void {
    push();
    // background
    translate(-this.cameraX, 0);
    image(images.testStage, 0, 0);
    // background(25, 35, 60);

    this.entities.forEach((entity) => {
      entity.draw();
    });

    // Draw all projectiles
    this.projectiles.forEach((projectile) => {
      projectile.draw();
    });

    pop();
    // demo text
    fill(255, 55, 99);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("PLAYING", width / 2, height / 4);

    textSize(18);
    text("Press ESC to pause", width / 2, height / 4 + 60);

    this.impacts.forEach((i) => {
      fill(255, 200, 0, i.life);
      noStroke();
      ellipse(i.pos.x, i.pos.y, 30);
    });
  }

  public keyPressed(code: number): void {
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new PauseScreen(this.game));
    }
    if (code === 74) {
      // J key
      console.log("J pressed");

      if (this.player.canShoot()) {
        console.log("Can shoot");

        const bullet = this.player.shoot(); // create projectile
        this.addProjectile(bullet); // store it
        sounds.shoot.play(); //real shoot sound
      }
    }
  }
}
