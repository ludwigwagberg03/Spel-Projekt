class GameOverScreen implements IScreen {
  private game: Game;
  private isWin: boolean;

  constructor(game: Game, isWin: boolean = false) {
    this.game = game;
    this.isWin = isWin;
  }

  public update() {}

  public draw() {
    background(0);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("GAME OVER", width / 2, height / 2 - 40);

    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 20);
  }

  public keyPressed(code: number): void {
    if (code === 82) {
      // R key
      this.game.changeScreen(new Level(this.game));
    }
  }
}
