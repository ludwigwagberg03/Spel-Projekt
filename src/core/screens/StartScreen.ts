class StartScreen implements IScreen {
  private game: Game;
  private time = 0;

  private stars = Array.from({ length: 80 }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  size: Math.random() * 2 + 1,
  speed: Math.random() * 0.15 + 0.05
}));


  // Menu
  private options = ["Nytt spel", "Ladda spel", "Inställningar", "Avsluta"];

  private selected = 0;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {}

 draw(): void {

  // Clear frame
  background(0);

  // ===== SKY ANIMATION =====
  this.time += 0.01;

  for (let y = 0; y < height; y++) {
    let t = y / height;

    let r = lerp(10, 2, t);
    let g = lerp(20, 5, t);
    let b = lerp(40, 20 + sin(this.time) * 10, t);

    stroke(r, g, b);
    line(0, y, width, y);
  }

  // ===== STARS =====
noStroke();
fill(255);

for (let s of this.stars) {
  circle(s.x, s.y, s.size);

  s.y += s.speed;

  if (s.y > height) {
    s.y = 0;
    s.x = random(width);
  }
}




  
  // Updated to use keyCode instead of key string for better performance
  keyPressed(code: number): void {
    if (code === UP_ARROW) this.selected--;
    if (code === DOWN_ARROW) this.selected++;

    if (this.selected < 0) this.selected = this.options.length - 1;
    if (this.selected >= this.options.length) this.selected = 0;

    if (code === ENTER) {
      const choice = this.options[this.selected];

      if (choice === "Nytt spel") {
        this.game.changeScreen(new PlayScreen(this.game));
      }

      if (choice === "Avsluta") {
        noLoop();
      }
    }
    
  }

  onEnter(): void {
    console.log("Start screen entered");
  }
}
