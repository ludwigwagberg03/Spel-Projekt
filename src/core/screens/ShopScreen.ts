class ShopScreen implements IScreen {
    private game: Game;
    private items = Items.swords

    private lastSelected = 0
    private selected = 0;

    constructor(game: Game) {
        this.game = game;
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
            console.log(this.items[this.selected])
        }
    }
}