import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Defining magic numbers
const begPoint = 0;

// Undo or Redo based on the values of l1 and l2
function undoRedo(l1: Point[][], l2: Point[][]) {
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
clearButton.addEventListener("click", () => c.clearCanvas(), false);
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

// Hold all context elements in this class
class Context {
  ctx;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  // Create a Canvas
  startCanvas() {
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(begPoint, begPoint, canvas.width, canvas.height);
  }

  // Clear canvas
  clearCanvas() {
    this.ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
    undoList = [];
    redoList = [];
    isDrawing = false;
  }

  // Change drawing
  display() {
    this.ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
    // Go thrugh all of the lines
    for (const line of undoList) {
      this.ctx.beginPath();
      // Go through all the points in the line and connect them with a path
      const [firstPoint, ...otherPoints] = line;
      const p: Point = firstPoint;
      this.ctx.moveTo(p.x, p.y);
      for (const p of otherPoints) {
        this.ctx.lineTo(p.x, p.y);
      }
      this.ctx.stroke();
    }
  }
}

// class Point {
//   x;
//   y;
//   // currentLine;
//   constructor(x: number = 0, y: number = 0) {
//     this.x = x;
//     this.y = y;
//     // this.currentLine = [{ x, y }];
//   }

//   drag(x: number, y: number) {
//     // this.currentLine.push({ x: x, y: y });
//     this.x += x;
//     this.y += y;
//   }
// }

const c = new Context(canvas.getContext("2d")!);
c.startCanvas();

// Event + Drawing
interface Point {
  x: number;
  y: number;
}
// let undoList: MarkerCommand[] = [];
// let redoList: MarkerCommand[];
// let currentLine: MarkerCommand[];
let undoList: Point[][] = [];
let redoList: Point[][] = [];
let linePoints: Point[];
let isDrawing = false;

// const drawLine = new Event("drawing-changed");
canvas.addEventListener("drawing-changed", () => {
  c.display();
});

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  linePoints = [];
  undoList.push(linePoints);
  linePoints.push({ x: e.offsetX, y: e.offsetY });
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    linePoints.push({ x: e.offsetX, y: e.offsetY });
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
    */
