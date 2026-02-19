class Game {
  private currentScreen: GameScreen;

  constructor() {
    this.currentScreen = new StartScreen(this);
    this.currentScreen.onEnter?.();
  }

  update(): void {
    this.currentScreen.update();
  }

  draw(): void {
    this.currentScreen.draw();
  }

  changeScreen(newScreen: GameScreen): void {
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
