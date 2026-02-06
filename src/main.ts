import "./style.css";
import {
  animationButton,
  arrowButton,
  canvas,
  colorPicker,
  controlsMenu,
  dimSpan,
  informationContainer,
  logoSpan,
  menuButton,
  pauseAllAnimationsButton,
  radiusInput,
  selectTypeInput,
} from "./dom/elements";
import type { CanvasObject } from "./shapes/CanvasObject";
import { Circle } from "./shapes/implementation/Circle";
import { Photo } from "./shapes/implementation/Photo";
import { drawSelectionEffect, getElementSettings } from "./lib/renderer";

const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasElements: CanvasObject[] = [];
let selectedElement: CanvasObject | null = null;
let isHoveringElement = false;
let savedVelocityX = 3;
let savedVelocityY = 2;

menuButton.addEventListener("click", () => {
  informationContainer.classList.toggle("active");
});

arrowButton.addEventListener("click", () => {
  controlsMenu.classList.toggle("active");
  arrowButton.classList.toggle("active");
});

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
  const settings = getElementSettings();
  if (settings.shape === "circle") {
    canvasElements.push(new Circle(x, y, settings.color, settings.radius));
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

selectTypeInput.addEventListener("change", (event: Event) => {
  if (event.target instanceof HTMLSelectElement) {
    const value = event.target.value;
    if (value === "photo") {
      colorPicker.classList.add("hidden");
      radiusInput.classList.add("hidden");
    } else if (value === "circle") {
      colorPicker.classList.remove("hidden");
      radiusInput.classList.remove("hidden");
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
