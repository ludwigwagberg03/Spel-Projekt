import { Game } from "./game";

let game: Game;

(window as any).setup = () => {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  game = new Game();
};
(window as any).draw = () => {
  game.update();
  game.draw();
};

(window as any).windowResized = () => {
  resizeCanvas(windowWidth, windowHeight);
};

(window as any).keyPressed = () => {
  game.keyPressed();
};