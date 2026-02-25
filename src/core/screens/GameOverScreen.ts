/// <reference path="./IScreen.ts" />

class GameOverScreen implements IScreen {
  private game: Game;
  private isWin: boolean;

  constructor(game: Game, isWin: boolean = false) {
    this.game = game;
    this.isWin = isWin;
  }

  public update() {}
  public draw() {}
}
