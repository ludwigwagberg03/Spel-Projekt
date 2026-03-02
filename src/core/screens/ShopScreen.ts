class ShopScreen implements IScreen {
    private game: Game;
    private player: Player;
    private level: Level;

    private items = Items.swords

    private lastSelected = 0
    private selected = 0;

    constructor(game: Game, player: Player, level: Level) {
        this.game = game;
        this.player = player;
        this.level = level;

        console.log("onwed", this.player.inventory.getItems());
    }
    update() {

    };
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
            if (!this.level.buyItems(this.items[this.selected].price)) {
                console.log("Not enough money");
                return;
            }
            this.player.inventory.addItem(this.items[this.selected]);
            console.log("added item", this.player.inventory.getItems());
        }
        if (code === 27) {
            console.log("enter level screen")
            this.game.changeScreen(new Level(this.game, this.player))
        }
    }
}