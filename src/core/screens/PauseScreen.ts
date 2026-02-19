class PauseScreen implements GameScreen {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }
  draw(): void {
    // dark overlay
    background(0, 150);

    fill(255);
    textAlign(CENTER, CENTER);

    textSize(50);
    text("PAUSED", width / 2, height / 2 - 80);

    textSize(22);
    text("ESC - Resume", width / 2, height / 2);
    text("M - Main Menu", width / 2, height / 2 + 40);
  }
  update(): void {}

  keyPressed(code: number): void {
    // resume game
    if (code === ESCAPE) this.game.changeScreen(new PlayScreen(this.game));

    // go to menu
    if (code === 77) this.game.changeScreen(new StartScreen(this.game));
  }
}

