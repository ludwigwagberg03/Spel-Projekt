class Level implements IScreen {
  private game: Game;
  private entities: entity[];
  private gravity = 0.8;
  private player: Player;
  private cameraX: number = 0;
  private worldWidth = 5760; // 1920 * 3

  constructor(game: Game) {
    this.game = game;

    this.entities = [];

    this.entities.push(new Platform(
      createVector(0, height / 2),
      createVector(0, 0),
      createVector(this.worldWidth, 10)
    ));

    this.player = new Player(
      createVector(this.worldWidth / 2, height / 2),

      createVector(0, 0),
      createVector(50, 100),
      100
    );

    this.entities.push(this.player);

    this.entities.push(new enemy(
      createVector(this.worldWidth / 2 - 30
        , height / 2),
      createVector(0, 0),
      createVector(50, 100),
      100,
      this.player
    ));
  }

  update(): void {
    this.cameraX = this.player.getPosition().x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.worldWidth - width);
    // update gameplay systems here later
    this.entities.forEach(entity => {
      entity.update(this.gravity, this.worldWidth);
    })
    this.checkCollision();
  }

  checkCollision() {
    // const { entities } = this;
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        if (this.entities[i].overlaps(this.entities[j])) {
          this.entities[i].onCollision(this.entities[j]);
          this.entities[j].onCollision(this.entities[i]);
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

    this.entities.forEach(entity => {
      entity.draw();
    });

    pop();
    // demo text
    fill(255, 55, 99);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("PLAYING", width / 2, height / 4);

    textSize(18);
    text("Press ESC to pause", width / 2, height / 4 + 60);
  }

  keyPressed(code: number): void {
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new PauseScreen(this.game));
    }
  }
}
