
// ===== STONE BUTTON DRAWER =====
function drawStoneButton(
  x: number,
  y: number,
  w: number,
  h: number,
  selected: boolean,
  label: string,
) {
  // shadow
  fill(0, 0, 0, 120);
  rect(x + 6, y + 6, w, h, 8);

  
  // bottom shadow (thickness)
  fill(40, 35, 30);
  rect(x, y + 6, w, h, 10);

  // main stone
  fill(70, 65, 60);
  rect(x, y, w, h, 10);

  // inner stone
  fill(110, 105, 95);
  rect(x + 4, y + 4, w - 8, h - 8, 8);

  // top light line
  stroke(180);
  line(x + 6, y + 6, x + w - 6, y + 6);
  noStroke();

  // glowing border if selected
  if (selected) {
    let glow = 180 + sin(frameCount * 0.08) * 70;
    stroke(255, 220, 120, glow);
    strokeWeight(3);
    noFill();
    rect(x - 2, y - 2, w + 4, h + 4, 12);
    noStroke();
  }

  // outlined text
  textAlign(CENTER, CENTER);
  textSize(28);

  fill(0);
  for (let ox = -2; ox <= 2; ox++) {
    for (let oy = -2; oy <= 2; oy++) {
      if (ox || oy) text(label, x + w / 2 + ox, y + h / 2 + oy);
    }
  }

  fill(selected ? color(255, 230, 150) : color(230));
  text(label, x + w / 2, y + h / 2);
}


class StartScreen implements IScreen {
  private game: Game;
  private time = 0;
  private inputLocked: boolean = true;
  private stars: { x: number; y: number; size: number; speed: number }[] = [];
  private player: Player;

  // Menu
  private options = ["Nytt spel", "Ladda spel", "Inställningar", "Avsluta"];

  private selected = 0;
  private lastSelected = 0;

  constructor(game: Game, player: Player) {
    this.game = game;
    this.player = player;

    // create stars (random positions, sizes and speeds)
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.15 + 0.05,
      });
    }
  }

  update(): void {}

  draw(): void {
    // ===== BACKGROUND IMAGE =====
    imageMode(CORNER);
    image(images.menu, 0, 0, width, height);

    // dark overlay for readability
    noStroke();
    fill(0, 0, 0, 140);
    rect(0, 0, width, height);

    // ===== STARS (FAR BACKGROUND) =====
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

    // ===== MOUNTAINS (MID LAYER) =====
    this.drawMountains(10, [15, 20, 35]);
    this.drawMountains(20, [20, 28, 50]);
    this.drawMountains(30, [30, 40, 70]);

    // ===== TITLE (UI LAYER) =====
    textAlign(CENTER, CENTER);

    const drawTitle = (txt: string, y: number, size: number, col: any) => {
      textSize(size);

      fill(0);
      for (let ox = -3; ox <= 3; ox++) {
        for (let oy = -3; oy <= 3; oy++) {
          if (ox || oy) text(txt, width / 2 + ox, y + oy);
        }
      }

      fill(col);
      text(txt, width / 2, y);
    };

    let glow = 200 + sin(frameCount * 0.05) * 55;
    drawTitle("Terrarian", height * 0.18, 72, color(255, 220, 120, glow));
    drawTitle("Boss Rush", height * 0.27, 42, color(240));

    // ===== MENU BUTTONS (FRONT UI) =====
    const btnW = 380;
    const btnH = 70;
    const gap = 18;

    // position menu relative to title instead of screen height
    const titleBottom = height * 0.27; // where "Boss Rush" text is
    const startY = titleBottom + 50; // fixed spacing under title

    for (let i = 0; i < this.options.length; i++) {
      const x = width / 2 - btnW / 2;
      const y = startY + i * (btnH + gap);

      drawStoneButton(x, y, btnW, btnH, i === this.selected, this.options[i]);
    }

    // ===== HELP TEXT (TOP UI) =====
    fill(220);
    textSize(20);
    text("↑ ↓  Navigate      ENTER  Select", width / 2, height - 40);
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

  // ================= INPUT =================
  keyPressed(code: number): void {
    // console.log("StartScreen key:", code);
    // remember old selection
    this.lastSelected = this.selected;
    if(this.inputLocked) return;
    // move selection
    if (code === UP_ARROW) this.selected--;
    if (code === DOWN_ARROW) this.selected++;

    // wrap menu
    if (this.selected < 0) this.selected = this.options.length - 1;
    if (this.selected >= this.options.length) this.selected = 0;

    // play tick if moved
    if (this.lastSelected !== this.selected) {
      sounds.tick.play();
    }

    // ENTER pressed
    if (code === ENTER) {
      sounds.confirm.play();

      const choice = this.options[this.selected];

      if (choice === "Nytt spel") {
        this.game.changeScreen(new Level(this.game, this.player));
      }

      if (choice === "Avsluta") {
        noLoop();
      }
    }
  }

  onEnter(): void {
    console.log("Start screen entered");

    setTimeout(()=>{this.inputLocked = false;}, 200);
  }
}
