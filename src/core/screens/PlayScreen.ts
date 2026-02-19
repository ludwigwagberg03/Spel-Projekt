class PlayScreen implements GameScreen
 {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {
    // update gameplay systems here later
   
  }

  draw(): void {
    // background
    background(25, 35, 60);

    // demo text
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("PLAYING", width / 2, height / 2);

    textSize(18);
    text("Press ESC to pause", width / 2, height / 2 + 60);
  }

  keyPressed(code: number): void {
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      // this.game.changeScreen(new StartScreen(this.game));
      this.game.changeScreen(new PauseScreen(this.game));
    }
  }
}
