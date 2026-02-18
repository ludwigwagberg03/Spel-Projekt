import { IScreen } from "./IScreen";
import { Game } from "./game";
import { level } from "./level";

export class startMenu implements IScreen {
    private game: Game;

    constructor(game: Game) {
        this.game = game;
    }
    keyPressed() {
        this.game.setScreen(new level(this.game));
    }
    update() {
        
    }
    draw() {
        // console.log("drawing menu");
        fill(255);
        background(51);
        text("Press somthing", 50, 50);
    }
}