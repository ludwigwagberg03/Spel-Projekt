class Game {
  private currentScreen: IScreen;
  private gameWon: boolean = false;
  private enemies: enemy[] = [];

  constructor() {
    this.currentScreen = new StartScreen(this);
    // this.currentScreen.onEnter?.();
  }

  // --- Win Game ---
  private handleWin(): void {
    this.gameWon = true;

    // Option 1: Go To GameOverScreen as WIN
    this.changeScreen(new GameOverScreen(this, true));

    // Option 2: Load Next Level instead
    // this.loadNextLevel();
  }
  update(): void {
    this.currentScreen.update();
    // --- Remove Dead Enemies ---
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      if (this.enemies[i].isDead) {
        this.enemies.splice(i, 1);
      }
    }

    // --- Check Win ---
    if (!this.gameWon && this.enemies.length === 0) {
      this.handleWin();
    }
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
}
