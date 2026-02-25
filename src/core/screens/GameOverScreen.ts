/// <reference path="./IScreen.ts" />

class GameOverScreen implements IScreen {
  private game: Game;
  private isWin: boolean;

  constructor(game: Game, isWin: boolean = false) {
    this.game = game;
    this.isWin = isWin;
  }

  public update() {}
  public draw() {
    text(this.isWin ? "YOU WIN!" : "GAME OVER", width / 2, height / 2 - 70);
    this.game.changeScreen(new Level(this.game));
  }
}
   