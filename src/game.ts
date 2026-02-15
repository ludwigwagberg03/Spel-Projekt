import { IScreen } from "core/screens/IScreen";
import { StartScreen } from "core/screens/StartScreen"

// import { StartScreen } from "core/screens/StartScreen";

export class Game {
  private currentScreen: IScreen;
  constructor() {
    this.currentScreen = new StartScreen(this);
    this.currentScreen.onEnter?.();
  }
}
