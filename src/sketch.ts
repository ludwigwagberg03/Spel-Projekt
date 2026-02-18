let game: Game;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  game = new Game();
};

function draw() {
  game.update();
  game.draw();
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};