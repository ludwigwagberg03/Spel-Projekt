class Level implements IScreen {
  private game: Game;
  private entities: entity[];
  private gravity = 0.8;
  private player: Player;

  constructor(game: Game) {
    this.game = game;

    this.entities = [];

    // console.log("fw")
    this.entities.push(new Platform(
      createVector(height / 2), createVector(0, 0), createVector(width, 10)
    ));

    this.player = new Player(
      createVector(width / 4, height / 2),
      createVector(0, 0),
      createVector(50, 100),
      100
    );

    this.entities.push(this.player);

    this.entities.push(new enemy(
      createVector(width / 3, height / 2),
      createVector(0, 0),
      createVector(50, 100),
      100,
      this.player
    )); 
  }

  update(): void {
    // update gameplay systems here later
    this.aplygravity();
    this.entities.forEach(entity => {
      entity.update();
    })
    this.checkColission(this.entities);

    if(this.player.lifeStatus === false){
      this.game.changeScreen(new StartScreen(this.game));
    }

  }

  checkColission(entities: entity[]) {
    let player!: Player;
    let plat!: Platform;

    for (const entity of entities) {
      if (entity instanceof Player) {
        player = entity
      }
      if (entity instanceof Platform) {
        plat = entity
      }
    }

    // for (const e1 of entities) {
    //     for (const e2 of entities) {
    //         if (e1 === e2) continue;
    //         if (e1.overlaps(e2)) {
    //             e1.onCollision(e2);
    //             e2.onCollision(e1);
    //         }
    //     }
    // }
    if (player && plat) {

      const playerBottom = player.position.y + player.size.y;
      const platformTop = plat.position.y;
      if (playerBottom >= platformTop && player.position.y < platformTop) {

        player.onCollision(plat);
      }
    }
  }

  draw(): void {
    // background
    background(25, 35, 60);

    // demo text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("PLAYING", width / 2, height / 4);

    textSize(18);
    text("Press ESC to pause", width / 2, height / 4 + 60);

    this.entities.forEach(entity => {
      entity.draw();
    });
  }

  aplygravity(): void {
    this.entities.forEach(entity => {
      if (entity.isgravity) {
        entity.velocity.y += this.gravity;
      }
    })
  }

  keyPressed(code: number): void {
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new PauseScreen(this.game));
    }
  }
}
