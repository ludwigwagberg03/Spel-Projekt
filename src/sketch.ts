let game: Game;
let gameFont: p5.Font;

let music: {
  mystery: p5.SoundFile;
};
let sounds: {
  coin: p5.SoundFile;
  tick: p5.SoundFile;
  confirm: p5.SoundFile;
};
let images: {
  treasury: p5.Image;
  pirate: p5.Image;
  menu: p5.Image;
  testStage: p5.Image;
};
let itemData: any;

/**
 * Built in preload function in P5
 * This is a good place to load assets such as
 * sound files, images etc...
 */
function preload() {
  music = {
    mystery: loadSound("/assets/music/mystery.mp3"),
  };
  sounds = {
    tick: loadSound("/assets/sounds/menu-selection.mp3"),
    confirm: loadSound("/assets/sounds/confirm.mp3"),
    coin: loadSound("/assets/sounds/coin.wav"),
  };
  images = {
    menu: loadImage("/assets/images/menu_bg.png"),
    testStage: loadImage("/assets/images/Frame 1 (1).png"),
    treasury: loadImage("/assets/images/treasury.png"),
    pirate: loadImage("/assets/images/pirate.png"),
  };
  gameFont = loadFont("/assets/fonts/minecraftia/Minecraftia-Regular.ttf");
  itemData = loadJSON("/assets/items/sword.json")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  music.mystery.setVolume(0.8);
  

  game = new Game();
};

function draw() {
  game.update();
  game.draw();
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//---- INPUT HANDLERS (keyCode) ----//
function keyPressed() {
  game.keyPressed(keyCode);
}

function mousePressed() {
  userStartAudio();
  game.mousePressed();
}