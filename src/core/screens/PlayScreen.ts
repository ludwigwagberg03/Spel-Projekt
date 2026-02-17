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
    background(0);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    text("PLAYING", width / 2, height / 2);
  }
  keyPressed(code: number): void {
    //press ESC to go back to start menu
    if (code === ESCAPE) {
      this.game.changeScreen(new StartScreen(this.game));
    }
  }
}
