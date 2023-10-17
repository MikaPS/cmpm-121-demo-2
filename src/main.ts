import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Defining magic numbers
const begPoint = 0;

// Undo or Redo based on the values of l1 and l2
function undoRedo(l1: MarkerCommand[], l2: MarkerCommand[]) {
  if (l1.length) {
    l2.push(l1.pop()!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
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
// Undo button
const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.addEventListener("click", () => undoRedo(undoList, redoList), false);
// Redo button
const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.addEventListener("click", () => undoRedo(redoList, undoList), false);

// Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "white";
ctx.fillRect(begPoint, begPoint, canvas.width, canvas.height);

function clearCanvas() {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  undoList = [];
  redoList = [];
  isDrawing = false;
}

// Step 5
class MarkerCommand {
  currentLine;
  // Creates a var that holds the x,y coords of the current line
  constructor(x: number = begPoint, y: number = begPoint) {
    this.currentLine = [{ x, y }];
  }
  // Grows the line as the user drags their mouse cursor
  drag(x: number, y: number) {
    this.currentLine.push({ x, y });
  }
  // Changes drawing
  display(ctx: CanvasRenderingContext2D) {
    // Go through all the points in the line and make a path between them
    ctx.beginPath();
    ctx.moveTo(this.currentLine[begPoint].x, this.currentLine[begPoint].y);
    for (const p of this.currentLine) {
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }
}
let undoList: MarkerCommand[] = [];
let redoList: MarkerCommand[] = [];
let marker: MarkerCommand = new MarkerCommand();
let isDrawing = false;

canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  // Go through all the lines and display them
  undoList.forEach((m: MarkerCommand) => {
    m.display(canvas.getContext("2d")!);
  });
});

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  marker = new MarkerCommand(e.offsetX, e.offsetY);
  undoList.push(marker);
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    marker.drag(e.offsetX, e.offsetY);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

// Stops drawing when mouse is up
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

row1.appendChild(canvas);
row2.appendChild(clearButton);
row2.appendChild(undoButton);
row2.appendChild(redoButton);
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
- Step 5: Used the explanation that Nicholas (the TA) and Adam wrote on the Discord
    */
