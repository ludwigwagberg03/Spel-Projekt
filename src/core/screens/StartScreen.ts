class StartScreen implements IScreen {
  private game: Game;

  // Menu
  private options = ["Nytt spel", "Ladda spel", "Inställningar", "Avsluta"];

  private selected = 0;

  constructor(game: Game) {
    this.game = game;
  }

  update(): void {}

  draw(): void {
    // Use your loaded font (from sketch.ts preload)
    textFont(gameFont);

    // Background
    background(12, 16, 28);

    // Title
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(64);
    text("Terrarian Boss Rush", width / 2, height * 0.22);

    // Subtitle
    textSize(20);
    fill(170);
    text("Ett Terraria-inspirerat bossäventyr", width / 2, height * 0.3);

    // Menu panel
    const panelW = 520;
    const panelH = 330;
    const panelX = width / 2 - panelW / 2;
    const panelY = height * 0.38;

    // Panel background
    noStroke();
    fill(240, 240, 240, 230);
    rect(panelX, panelY, panelW, panelH, 18);

    // Menu buttons
    // const btnW = 420;
    // const btnH = 60;
    // const startY = panelY + 70;
    // const gap = 18;

    const btnW = 420;
    const btnH = 60;
    const gap = 18;

    // calculate total menu height
    const totalHeight =
      this.options.length * btnH + (this.options.length - 1) * gap;

    // center inside panel
    const startY = panelY + (panelH - totalHeight) / 2;

    for (let i = 0; i < this.options.length; i++) {
      const x = width / 2 - btnW / 2;
      const y = startY + i * (btnH + gap);

      // Highlight selected
      if (i === this.selected) {
        fill(210, 210, 210);
        rect(x, y, btnW, btnH, 14);

        // small arrow at left
        fill(40);
        textSize(18);
        text("▶", x + 28, y + btnH / 2 + 2);
      } else {
        fill(225, 225, 225);
        rect(x, y, btnW, btnH, 14);
      }

      // Button text
      fill(30);
      textSize(26);
      text(this.options[i], width / 2, y + btnH / 2 + 2);
    }

    // ===== Bottom help bar =====
    const helpBarH = 60;

    // background strip
    noStroke();
    fill(0, 0, 0, 160);
    rect(0, height - helpBarH, width, helpBarH);

    // text
    fill(255);
    textSize(16);
    textAlign(CENTER, CENTER);
    textSize(20);

    // shadow for readability
    fill(0);
    text(
      "Piltangenter  -  Navigera      ENTER  -  Välj",
      width / 2 + 2,
      height - helpBarH / 2 + 2,
    );

    fill(255);
    text(
      "Piltangenter  -  Navigera      ENTER  -  Välj",
      width / 2,
      height - helpBarH / 2,
    );
  }

  // keyPressed(key: string): void {
  //   if (key === "ArrowUp") this.selected--;
  //   if (key === "ArrowDown") this.selected++;

  //   if (this.selected < 0) this.selected = this.options.length - 1;
  //   if (this.selected >= this.options.length) this.selected = 0;

  //   if (key === "Enter") {
  //     const choice = this.options[this.selected];

  //     if (choice === "Nytt spel") {
  //       this.game.changeScreen(new PlayScreen(this.game));
  //     }

  //     if (choice === "Avsluta") {
  //       noLoop();
  //     }
  //   }
  // }

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
