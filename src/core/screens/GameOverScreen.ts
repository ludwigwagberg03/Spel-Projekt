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
    text("GAME OVER", width / 2, height / 2 - 60);

    textSize(24);
    text("Press R to Restart", width / 2, height / 2 + 10);
    text("Press M for Main Menu", width / 2, height / 2 + 50);
  }

  public keyPressed(code: number): void {
    // R = restart level
    if (code === 82) {
      this.game.changeScreen(new Level(this.game));
    }

    // M = go to main menu
    if (code === 77) {
      this.game.changeScreen(new StartScreen(this.game));
    }
  }
}
