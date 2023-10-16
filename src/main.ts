import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Defining magic numbers
const begPoint = 0;
const advance = 1;

// Clear canvas
function clearCanvas() {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  mousePoints = [];
  isDrawing = false;
}

// Title
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
const board = document.createElement("div");
const row1 = document.createElement("div");
const row2 = document.createElement("div");

// Clear button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.addEventListener("click", () => clearCanvas(), false);

// Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext("2d")!;
if (ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Event + Drawing
interface Point {
  x: number;
  y: number;
}
let mousePoints: Point[][] = [];
let linePoints: Point[];
let isDrawing = false;
const drawLine = new Event("drawing-changed");
canvas.addEventListener("drawing-changed", () => {
  // Go thrugh all of the lines
  for (const line of mousePoints) {
    ctx.beginPath();
    // Go through all the points in the line and connect them with a path
    for (let i = begPoint; i < line.length; i += advance) {
      const p: Point = line[i];
      if (i == begPoint) {
        ctx.moveTo(p.x, p.y);
      }
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
});

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  linePoints = [];
  mousePoints.push(linePoints);
  linePoints.push({ x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    linePoints.push({ x: e.offsetX, y: e.offsetY });
    canvas.dispatchEvent(drawLine);
  }
});

// Stops drawing when mouse is up
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

row1.appendChild(canvas);
row2.appendChild(clearButton);
board.appendChild(row1);
board.appendChild(row2);
app.append(header);
app.append(board);

/*
Credits:
- In all steps, used the resources provided on the slides (including the code examples)
- Explained how to use "as HTMLCanvasElement" to not have a problem with the possability of a null canvas
    https://kernhanda.github.io/tutorial-typescript-canvas-drawing/
- Custom events:
    - https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggerin
    */
