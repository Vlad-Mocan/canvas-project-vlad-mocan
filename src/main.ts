import type { CanvasObject } from "./shapes/CanvasObject";
import { Circle } from "./shapes/implementation/Circle";
import { Photo } from "./shapes/implementation/Photo";
import "./style.css";

const logoSpan = document.querySelector<HTMLSpanElement>("#logo-val")!;
const dimSpan = document.querySelector<HTMLSpanElement>("#dim-val")!;
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const animationButton =
  document.querySelector<HTMLButtonElement>(".animation-btn")!;
const menuButton = document.querySelector<HTMLButtonElement>(".menu-btn")!;
const informationContainer =
  document.querySelector<HTMLDivElement>(".information")!;
const arrowButton = document.querySelector<HTMLButtonElement>(".arrow-btn")!;
const controlsMenu = document.querySelector<HTMLDivElement>(".controls")!;
const pauseAllAnimationsButton =
  document.querySelector<HTMLButtonElement>(".pause-all")!;

const ctx = canvas.getContext("2d")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

menuButton.addEventListener("click", () => {
  informationContainer.classList.toggle("active");
});

arrowButton.addEventListener("click", () => {
  controlsMenu.classList.toggle("active");
  arrowButton.classList.toggle("active");
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  dimSpan.textContent = `${window.innerWidth} x ${window.innerHeight}`;
});

const canvasElements: CanvasObject[] = [];
let selectedElement: CanvasObject | null = null;
let isHoveringElement = false;
let savedVelocityX = 3;
let savedVelocityY = 2;

const getElementSettings = () => {
  const shapeInput =
    document.querySelector<HTMLInputElement>("#type-of-element")!;
  const colorInput = document.querySelector<HTMLInputElement>("#color-picker")!;

  return {
    shape: shapeInput.value,
    colorInput: colorInput.value,
  };
};

const drawSelectionEffect = (
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

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = canvasElements.length - 1; i >= 0; i--) {
    const el = canvasElements[i];
    if (el.isSelected(x, y)) {
      selectedElement = el;

      if (selectedElement.isDuringAnimation) {
        animationButton.textContent = "Pause Animation";
      } else {
        animationButton.textContent = "Resume Animation";
      }

      return;
    }
  }

  const radius = 12 + Math.random() * 18;

  const settings = getElementSettings();
  if (settings.shape === "circle") {
    canvasElements.push(new Circle(x, y, settings.colorInput, radius));
  } else if (settings.shape === "photo") {
    canvasElements.push(new Photo(x, y, "/dvd-logo.png", 150, 100));
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  isHoveringElement = false;

  for (let i = canvasElements.length - 1; i >= 0; i--) {
    if (canvasElements[i].isSelected(x, y)) {
      isHoveringElement = true;
      break;
    }
  }
});

animationButton.addEventListener("click", () => {
  if (!selectedElement) return;

  if (selectedElement.isDuringAnimation) {
    animationButton.textContent = "Resume Animation";

    savedVelocityX = selectedElement.velocityX ?? 3;
    savedVelocityY = selectedElement.velocityY ?? 2;

    selectedElement.velocityX = 0;
    selectedElement.velocityY = 0;

    selectedElement.isDuringAnimation = false;
  } else {
    animationButton.textContent = "Pause Animation";

    selectedElement.velocityX = savedVelocityX;
    selectedElement.velocityY = savedVelocityY;

    selectedElement.isDuringAnimation = true;
  }
});

pauseAllAnimationsButton.addEventListener("click", () => {
  const duringAnimationElements = canvasElements.filter(
    (canvasElement) => canvasElement.isDuringAnimation,
  );

  if (duringAnimationElements.length) {
    duringAnimationElements.forEach((el) => {
      el.isDuringAnimation = false;
    });
    pauseAllAnimationsButton.textContent = "Resume All Elements";
  } else {
    canvasElements.forEach((canvasElement) => {
      if (!canvasElement.isDuringAnimation) {
        canvasElement.isDuringAnimation = true;
      }
      pauseAllAnimationsButton.textContent = "Pause All Elements";
    });
  }
});

function loop(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvasElements.forEach((canvasElement) => {
    canvasElement.update(canvas.width, canvas.height);
    canvasElement.draw(ctx);

    if (canvasElement === selectedElement) {
      drawSelectionEffect(ctx, canvasElement);
    }
  });

  if (selectedElement) {
    logoSpan.textContent = `${Math.floor(selectedElement.x)}, ${Math.floor(selectedElement.y)}`;
  }

  dimSpan.textContent = `${window.innerWidth} x ${window.innerHeight}`;

  canvas.style.cursor = isHoveringElement ? "pointer" : "default";

  requestAnimationFrame(loop);
}

loop();
