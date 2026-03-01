class PauseScreen implements IScreen {
  private game: Game;
  private player: Player;

  constructor(game: Game, player: Player) {
    this.game = game;
    this.player = player;
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
    if (code === ESCAPE) this.game.changeScreen(new Level(this.game, this.player));

    // go to menu
    if (code === 77) this.game.changeScreen(new StartScreen(this.game, this.player));
  }
}

