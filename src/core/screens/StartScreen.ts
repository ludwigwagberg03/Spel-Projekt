import { IScreen } from "./IScreen";

export class StartScreen implements IScreen {
  constructor(private game: any) {}

  update(): void {
    // update logic
  }

  draw(): void {
    // draw logic
  }

  onEnter?(): void {
    console.log("Start screen entered");
  }
}
