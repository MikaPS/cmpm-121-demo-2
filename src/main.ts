import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Defining magic numbers
const begPoint = 0;

// Step 6
class BrushSizeCommand {
  brushSize: number;
  constructor() {
    this.brushSize = 3;
  }

  changeBrush(isThin: boolean) {
    if (isThin) {
      this.brushSize -= 1;
    } else {
      this.brushSize += 1;
    }
    console.log(this.brushSize);
  }

  resetBrush() {
    this.brushSize = 3;
  }
}
// Undo or Redo based on the values of l1 and l2
function undoRedo(
  l1: MarkerCommand[],
  l2: MarkerCommand[],
  l3: number[],
  l4: number[]
) {
  if (l1.length) {
    l2.push(l1.pop()!);
    l4.push(l3.pop()!);
    console.log(
      "undo: ",
      l1.length,
      " redo: ",
      l2.length,
      " undo brush: ",
      l3.length,
      " redo brush: ",
      l4.length
    );
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
const row3 = document.createElement("div");

// Clear button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.addEventListener("click", () => clearCanvas(), false);
// Undo button
const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.addEventListener(
  "click",
  () => undoRedo(undoList, redoList, undoBrushList, redoBrushList),
  false
);
// Redo button
const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.addEventListener(
  "click",
  () => undoRedo(redoList, undoList, redoBrushList, undoBrushList),
  false
);
// Brush size class var
const brush = new BrushSizeCommand();
// Thin button
const thinButton = document.createElement("button");
thinButton.innerHTML = "Thin";
thinButton.addEventListener("click", () => brush.changeBrush(true), false);
// Thick button
const thickButton = document.createElement("button");
thickButton.innerHTML = "Thick";
thickButton.addEventListener("click", () => brush.changeBrush(false), false);

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
  brush.resetBrush();
  undoBrushList = [];
  redoBrushList = [];
}

// Step 5
class MarkerCommand {
  currentLine;
  // brush;
  // Creates a var that holds the x,y coords of the current line
  constructor(x: number = begPoint, y: number = begPoint) {
    this.currentLine = [{ x, y }];
    // this.brush = new BrushSizeCommand();
  }
  // Grows the line as the user drags their mouse cursor
  drag(x: number, y: number) {
    this.currentLine.push({ x, y });
  }
  // Changes drawing
  display(ctx: CanvasRenderingContext2D, brushSize: number) {
    // Go through all the points in the line and make a path between them
    ctx.lineWidth = brushSize;
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
let undoBrushList: number[] = [];
let redoBrushList: number[] = [];

let isDrawing = false;

canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  // Go through all the lines and display them
  let count = 0;
  undoList.forEach((m: MarkerCommand) => {
    m.display(canvas.getContext("2d")!, undoBrushList[count]);
    count += 1;
  });
});

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  marker = new MarkerCommand(e.offsetX, e.offsetY);
  undoList.push(marker);
  undoBrushList.push(brush.brushSize);
  console.log(
    "brush size: ",
    undoBrushList.length,
    " brushes: ",
    undoBrushList
  );
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
row3.appendChild(thinButton);
row3.appendChild(thickButton);
board.appendChild(row1);
board.appendChild(row2);
board.appendChild(row3);
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
