import { IScreen } from "./IScreen";
import { startMenu } from "./startMenu";
export class Game {
  private currentScreen: IScreen;
  
  constructor() {
    this.currentScreen = new startMenu(this);
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
