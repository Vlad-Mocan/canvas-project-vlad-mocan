import { CanvasObject } from "../CanvasObject";

export class Photo extends CanvasObject {
  private img: HTMLImageElement;
  public width: number;
  public height: number;

  constructor(
    x: number,
    y: number,
    src: string,
    width: number,
    height: number,
    isDuringAnimation: boolean = true,
  ) {
    super(x, y, "transparent", isDuringAnimation);
    this.width = width;
    this.height = height;

    this.velocityX = 4;
    this.velocityY = 3;

    this.img = new Image();
    this.img.src = src;
  }

  update(canvasWidth: number, canvasHeight: number): void {
    if (!this.isDuringAnimation) return;

    this.x += this.velocityX;
    this.y += this.velocityY;

    if (this.x + this.width > canvasWidth || this.x <= 0) {
      this.velocityX *= -1;
    }

    if (this.y + this.height > canvasHeight || this.y <= 0) {
      this.velocityY *= -1;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  isSelected(x: number, y: number): boolean {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
}
