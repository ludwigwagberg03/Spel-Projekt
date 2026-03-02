interface IScreen {
    update(): void;
    draw(): void;

    onEnter?(): void;
    onExit?(): void;

    keyPressed?(code: number): void;
    mousePressed?(): void;
    mouseReleased?(): void;
}