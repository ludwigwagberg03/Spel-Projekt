
interface IScreen {
  update(): void;
  draw(): void;

  onEnter?(): void;
  onExit?(): void;

  // keyPressed?(key: string): void;
  keyPressed?(code: number): void;

  mousePressed?(): void;
}
