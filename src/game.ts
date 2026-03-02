class Game {
  private currentScreen: IScreen;
  

  constructor() {
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
