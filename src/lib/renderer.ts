import { colorPicker, radiusInput } from "../dom/elements";
import type { CanvasObject } from "../shapes/CanvasObject";
import { Circle } from "../shapes/implementation/Circle";
import { Photo } from "../shapes/implementation/Photo";

export const getElementSettings = () => {
  const shapeInput =
    document.querySelector<HTMLInputElement>("#type-of-element")!;

  const defaultRadius = 12 + Math.random() * 18;

  if (radiusInput.valueAsNumber > 300) {
    radiusInput.valueAsNumber = 300;
  } else if (
    radiusInput.valueAsNumber < 1 ||
    radiusInput.valueAsNumber === null
  ) {
    radiusInput.valueAsNumber = 1;
  }

  return {
    shape: shapeInput.value,
    color: colorPicker.value || "#000",
    radius: radiusInput.valueAsNumber || defaultRadius,
  };
};

export const drawSelectionEffect = (
  ctx: CanvasRenderingContext2D,
  el: CanvasObject,
) => {
  ctx.save();

  ctx.shadowColor = "rgba(0, 150, 255, 0.9)";
  ctx.shadowBlur = 18;

  if (el instanceof Circle) {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00A2FF";
    ctx.setLineDash([6, 4]);
    ctx.arc(el.x, el.y, el.radius + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  } else if (el instanceof Photo) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#00A2FF";
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(el.x - 3, el.y - 3, el.width + 6, el.height + 6);
  }

  ctx.restore();
};
