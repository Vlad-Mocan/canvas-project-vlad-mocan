import { CanvasObject } from "../CanvasObject";

export class Circle extends CanvasObject {
  public radius: number;

  constructor(
    x: number,
    y: number,
    color: string,
    radius: number,
    isDuringAnimation: boolean = true,
  ) {
    super(x, y, color, isDuringAnimation);
    this.radius = radius;

    this.velocityX = 3;
    this.velocityY = 2;
  }

  update(canvasWidth: number, canvasHeight: number): void {
    if (!this.isDuringAnimation) return;

    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
      this.velocityX *= -1;
    }

    if (this.y + this.radius > canvasHeight || this.y - this.radius < 0) {
      this.velocityY *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  isSelected(x: number, y: number): boolean {
    const distanceToCenterX = x - this.x;
    const distanceToCenterY = y - this.y;

    return (
      distanceToCenterX * distanceToCenterX +
        distanceToCenterY * distanceToCenterY <=
      this.radius * this.radius
    );
  }
}
