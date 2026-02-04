export interface IEntity {
  x: number;
  y: number;
  color: string;
  update(canvasWidth: number, canvasHeight: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}
