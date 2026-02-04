import type { IEntity } from "./IEntity";

export abstract class CanvasObject implements IEntity {
  public x: number;
  public y: number;
  public color: string;

  public velocityX: number = 0;
  public velocityY: number = 0;

  public isDuringAnimation: boolean;

  constructor(x: number, y: number, color: string, isDuringAnimation: boolean) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.isDuringAnimation = isDuringAnimation;
  }

  abstract isSelected(x: number, y: number): boolean;
  abstract update(canvasWidth: number, canvasHeight: number): void;
  abstract draw(ctx: CanvasRenderingContext2D): void;
}
