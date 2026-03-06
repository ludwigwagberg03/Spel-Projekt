class ShopScreen implements IScreen {
    private game: IChangableScreen;
    private player: Player;
    private level: Level;
    // IChangableScreen
    private items: Item[] = [];

    private selected = 0;

    constructor(game: IChangableScreen, player: Player, level: Level) {
        this.game = game;
        this.player = player;
        this.level = level;

        this.items = this.getRandomItems(3);


    }

    private getRandomItems(count: number): Item[] {

        const availableItems: Item[] = [];

        for (let i = 0; i < Items.swords.length; i++) {
            if (!this.player.inventory.hasItem(Items.swords[i].id)) {
                availableItems.push(Items.swords[i]);
            }
        }

        if (availableItems.length === 0) {
            return [];
        }

        const shuffled = [...availableItems];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.slice(0, count);
    }

    public buyItems(itemCost: number): boolean {
        if (this.player.coinCount >= itemCost) {
            this.player.coinCount -= itemCost;
            return true;
        }
        return false;
    }

    update() { };

    draw() {
        background(0);

        stroke(0, 120, 255);
        strokeWeight(4);
        fill(20, 40, 120, 150); 
        rect(width / 2 - 250, 120, 500, height - 200, 10);

        fill(255);
        textAlign(CENTER, CENTER);

        textSize(50);
        text("SHOP", width / 2, 80);

        textSize(20);
        text(this.player.coinCount+ " Player gold", width / 2, height - 100);

        const spacingX = 20;
        const spacingY = 20;

        const slotWidth = 120;
        const slotHeight = 120;
        const imageSize = 64;

        let x = width / 2 - slotWidth / 2;
        let y = 150;

        for (let i = 0; i < this.items.length; i++) {

            if (y + slotHeight > height - 50) {
                y = 150;
                x += slotWidth + spacingX;
            }

            stroke(255);
            strokeWeight(2);

            if (i === this.selected) {
                let glow = 180 + sin(frameCount * 0.08) * 70;
                stroke(0, 120, 255, glow);
            }

            noFill();
            rect(x, y, slotWidth, slotHeight, 6);

            noStroke();

            if (this.items[i].type === "ranged") {
                image(images.bowImage, x + (slotWidth - imageSize) / 2, y + 10, imageSize, imageSize);
            }

            if (this.items[i].type === "melee") {
                image(images.swordImage, x + (slotWidth - imageSize) / 2, y + 10, imageSize, imageSize);
            }

            fill(255);
            textSize(14);
            textAlign(CENTER, TOP);
            text(this.items[i].name, x + slotWidth / 2, y + 10 + imageSize + 5);

            fill(255, 220, 100);
            textSize(12);
            text(this.items[i].price + " gold", x + slotWidth / 2, y + 10 + imageSize + 22);

            y += slotHeight + spacingY;
        }
    };

    keyPressed(code: number): void {
        // move selection
        if (code === UP_ARROW) this.selected--;
        if (code === DOWN_ARROW) this.selected++;

        // wrap menu
        if (this.selected < 0) this.selected = this.items.length - 1;
        if (this.selected >= this.items.length) this.selected = 0;

        if (code === ENTER) {

            if (this.player.inventory.hasItem(this.items[this.selected].id)) {
                alert("already owned");
                return;
            }
            if (!this.buyItems(this.items[this.selected].price)) {
                alert("Not enough money");
                return;
            }
            this.player.inventory.addItem(this.items[this.selected]);


            this.items.splice(this.selected, 1);

            if (this.selected >= this.items.length) {
                this.selected = this.items.length - 1;
            }
        }
        if (code === 27) {

            this.game.changeScreen(this.level)
        }
    }
}