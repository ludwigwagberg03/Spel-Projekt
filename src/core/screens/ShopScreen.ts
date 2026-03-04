class ShopScreen implements IScreen {
    private game: IChangableScreen;
    private player: Player;
    private level: Level;
    // IChangableScreen
    private items: Item[] = [];

    private lastSelected = 0;
    private selected = 0;

    constructor(game: IChangableScreen, player: Player, level: Level) {
        this.game = game;
        this.player = player;
        this.level = level;

        this.items = this.getRandomItems(3);

        console.log("onwed", this.player.inventory.getItems());
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

        fill(255);
        textAlign(CENTER, CENTER);

        textSize(50);
        text("SHOP", width / 2, 80);

        textSize(20);

        for (let i = 0; i < this.items.length; i++) {
            fill(255);

            if (i === this.selected) {
                fill(60);
            }

            text(
                `${this.items[i].name} - ${this.items[i].price} gold`,
                width / 2,
                200 + i * 100
            );
        }
    };

    keyPressed(code: number): void {

        this.lastSelected = this.selected;

        // move selection
        if (code === UP_ARROW) this.selected--;
        if (code === DOWN_ARROW) this.selected++;

        // wrap menu
        if (this.selected < 0) this.selected = this.items.length - 1;
        if (this.selected >= this.items.length) this.selected = 0;

        if (code === ENTER) {

            if (this.player.inventory.hasItem(this.items[this.selected].id)) {
                console.log("already owned");
                return;
            }
            if (!this.buyItems(this.items[this.selected].price)) {
                console.log("Not enough money");
                return;
            }
            this.player.inventory.addItem(this.items[this.selected]);
            console.log("added item", this.player.inventory.getItems());

            this.items.splice(this.selected, 1);

            if (this.selected >= this.items.length) {
                this.selected = this.items.length - 1;
            }
        }
        if (code === 27) {
            console.log("enter level screen")
            this.game.changeScreen(new Level(this.game, this.player))
        }
    }
}