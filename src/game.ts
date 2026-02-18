import { IScreen } from "./IScreen";
import { startMenu } from "./startMenu";
export class Game {
  private currentScreen: IScreen;
  private gameInstance = this
  
  constructor() {
    this.currentScreen = new startMenu(this.gameInstance);
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
