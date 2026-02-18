class Game {
  private currentScreen: IScreen;
  
  constructor() {
    this.currentScreen = new StartMenu(this);
  }
  setScreen(screen: IScreen) {
    this.currentScreen = screen;
  }

  keyPressed() {
    // console.log("On screen",this.currentScreen)
    this.currentScreen.keyPressed();
    // console.log("after",this.currentScreen)
  }
  update() {
    this.currentScreen.update();
  }
  draw() {
    this.currentScreen.draw();
  }
}
