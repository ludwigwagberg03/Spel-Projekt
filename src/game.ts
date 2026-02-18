class Game {
  private currentScreen: IScreen;
  
  constructor() {
    this.currentScreen = new StartMenu(this);
  }
  setScreen(screen: IScreen) {
    this.currentScreen = screen;
  }

  update() {
    this.currentScreen.update();
    
  }
  draw() {
    this.currentScreen.draw();
  }
}
