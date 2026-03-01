/// <reference path="./IScreen.ts" />

class GameOverScreen implements IScreen {
  private game: Game;
  private isWin: boolean;
  private player: Player;

  constructor(game: Game, isWin: boolean = false, player:Player) {
    this.game = game;
    this.isWin = isWin;
    this.player = player;
  }

  public update() {}
  public draw() {
    text(this.isWin ? "YOU WIN!" : "GAME OVER", width / 2, height / 2 - 70);
    this.game.changeScreen(new Level(this.game, this.player));
  }
}
   