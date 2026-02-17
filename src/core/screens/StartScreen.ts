class StartScreen implements IScreen {
  private game: Game;
  private time = 0;

  private stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.15 + 0.05,
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
    // ===== MOUNTAINS =====
    this.drawMountains(10, [15, 20, 35]);
    this.drawMountains(20, [20, 28, 50]);
    this.drawMountains(30, [30, 40, 70]);

    // ===== TITLE =====
    textAlign(CENTER, CENTER);
    textSize(64);
    fill(255);
    text("Terrarian x Boss Rush", width / 2, height * 0.22);

    // ===== MENU =====
    const panelW = 520;
    const panelH = 330;
    const panelX = width / 2 - panelW / 2;

    let floatY = sin(frameCount * 0.04) * 6;
    const panelY = height * 0.38 + floatY;

    noStroke();
    fill(240, 240, 240, 230);
    rect(panelX, panelY, panelW, panelH, 18);

    const btnW = 420;
    const btnH = 60;
    const gap = 18;

    const totalHeight =
      this.options.length * btnH + (this.options.length - 1) * gap;

    const startY = panelY + (panelH - totalHeight) / 2;

    for (let i = 0; i < this.options.length; i++) {
      const x = width / 2 - btnW / 2;
      const y = startY + i * (btnH + gap);

      if (i === this.selected) {
        fill(210, 210, 210);
        rect(x, y, btnW, btnH, 14);

        fill(40);
        textSize(18);
        text("▶", x + 28, y + btnH / 2 + 2);
      } else {
        fill(225, 225, 225);
        rect(x, y, btnW, btnH, 14);
      }

      fill(30);
      textSize(26);
      text(this.options[i], width / 2, y + btnH / 2 + 2);
    }

    // ===== HELP TEXT =====
    fill(180);
    textSize(18);
    text("Piltangenter – Navigera     ENTER – Välj", width / 2, height - 40);
  }

  // ================= MOUNTAINS (SEPARATE METHOD) =================
  drawMountains(offset: number, color: number[]) {
    fill(color[0], color[1], color[2]);
    noStroke();
    beginShape();

    for (let x = 0; x <= width; x += 40) {
      let y = height - 120 + noise(x * 0.01 + offset, this.time * 0.2) * 80;
      vertex(x, y);
    }

    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  }

  onEnter(): void {
    console.log("Start screen entered");
  }
}
