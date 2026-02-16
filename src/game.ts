class Game {
  private currentScreen: IScreen;

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

  changeScreen(newScreen: IScreen): void {
    this.currentScreen.onExit?.();
    this.currentScreen = newScreen;
    this.currentScreen.onEnter?.();
  }

  keyPressed(code: number): void {
    this.currentScreen.keyPressed?.(code);
  }

  mousePressed(): void {
    this.currentScreen.mousePressed?.();
  }
}
