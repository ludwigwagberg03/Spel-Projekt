interface IChangableScreen {
  changeScreen(newScreen: IScreen): void;
}

class Game implements IChangableScreen {
  private currentScreen: IScreen;
  private player: Player;

  public getPlayer(): Player {
    return this.player;
  }

  constructor(player: Player) {
    this.player = player;
    this.currentScreen = new StartScreen(this);
    this.currentScreen.onEnter?.();
  }

  // --- Win Game ---

  update(): void {
    this.currentScreen.update();
    // --- Remove Dead Enemies ---
  }

  draw(): void {
    this.currentScreen.draw();
  }

  changeScreen(newScreen: IScreen): void {
    this.currentScreen.onExit?.();
    this.currentScreen = newScreen;
    this.currentScreen.onEnter?.();
  }

  keyPressed(code: number): void {
    if (this.currentScreen && this.currentScreen.keyPressed) {
      this.currentScreen.keyPressed(code);
    }
  }

  mousePressed(): void {
    this.currentScreen.mousePressed?.();
  }
  mouseReleased(): void {
    this.currentScreen.mouseReleased?.();
  }
}
