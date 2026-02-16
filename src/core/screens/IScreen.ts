
interface IScreen {
  update(): void;
  draw(): void;

  onEnter?(): void;
  onExit?(): void;

  keyPressed?(key: string): void;
  mousePressed?(): void;
}
