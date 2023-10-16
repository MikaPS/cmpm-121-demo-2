import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
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

// Drawing
const mousePoints: number[][] = [];
let isDrawing = false;

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  mousePoints.push([e.offsetX, e.offsetY]);
  isDrawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    ctx.lineWidth = 0.5; // Sets line width
    ctx.beginPath(); // Clear button doesn't work without using paths
    const lastestMove = mousePoints[mousePoints.length - 1];
    ctx.moveTo(lastestMove[0], lastestMove[1]); // Starts the drawing from the old x,y coords
    ctx.lineTo(e.offsetX, e.offsetY); // Move to the new x,y coords
    ctx.stroke(); // Actuall draws the line
    mousePoints.push([e.offsetX, e.offsetY]);
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
- In all steps, used the resources provided on the slides
- Explained how to use "as HTMLCanvasElement" to not have a problem with the possability of a null canvas
    https://kernhanda.github.io/tutorial-typescript-canvas-drawing/
*/
