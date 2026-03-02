class Game {
  // Currently active screen
  private currentScreen: IScreen;
  

  constructor() {
    // Start the game at the main menu
    this.currentScreen = new StartScreen(this);
  }

  // --- Win Game ---
  
  update(): void {
    this.currentScreen.update();
    // --- Remove Dead Enemies ---
    
  }

  // Called every frame (render)
  draw(): void {
    this.currentScreen.draw();
  }

  // Switch to a different screen
  changeScreen(newScreen: IScreen): void {
    this.currentScreen.onExit?.();
    this.currentScreen = newScreen;
    this.currentScreen.onEnter?.();
  }

  // Forward keyboard input to active screen
  keyPressed(code: number): void {
    this.currentScreen.keyPressed?.(code);
  }

  // Forward mouse input to active screen
  mousePressed(): void {
    this.currentScreen.mousePressed?.();
  }
  mouseReleased(): void {
    this.currentScreen.mouseReleased?.();
  }
}
