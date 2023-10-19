import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Defining magic numbers
const begPoint = 0;
const nonNeg = 1;

// Step 6: I took it a step further and made even more options for marker sizes. I believe it's the same logic as requested on the slides.
class BrushSizeCommand {
  brushSize: number;
  intialSize = 2;
  constructor() {
    this.brushSize = this.intialSize;
  }

  // Clicking on thin/thick buttons would change the brush size by 1
  changeBrush(isThin: boolean) {
    if (isThin) {
      if (this.brushSize > nonNeg) {
        this.brushSize--;
      }
    } else {
      this.brushSize++;
    }
    brushSize.innerHTML = "Brush Size: " + this.brushSize;
  }

  // Reset the brush to intial state
  resetBrush() {
    this.brushSize = this.intialSize;
    brushSize.innerHTML = "Brush Size: " + this.brushSize;
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
const row4 = document.createElement("div");

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
// Display brush size on screen
const brushSize = document.createElement("div");
brushSize.innerHTML = "Brush Size: " + brush.brushSize;

// STICKERS
let s1 = false;
const sticker1 = document.createElement("button");
sticker1.innerHTML = "😎";
sticker1.addEventListener("click", () => {
  s1 = true;
  // isPlacingSticker = true;
  canvas.dispatchEvent(new Event("tool-moved")), false;
});
const sticker2 = document.createElement("button");
sticker2.innerHTML = "👀";
sticker2.addEventListener(
  "click",
  () => canvas.dispatchEvent(new Event("tool-moved")),
  false
);
const sticker3 = document.createElement("button");
sticker3.innerHTML = "🧐";
sticker3.addEventListener("click", () => {
  canvas.dispatchEvent(new Event("tool-moved")), false;
});

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

// Step 8

class StickerCommand {
  x;
  y;
  sticker;
  constructor(x: number = begPoint, y: number = begPoint, sticker: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = scale + scale + "px Times New Roman";
    ctx.fillText(this.sticker, this.x - scale - brush.brushSize, this.y);
    // s1Placed = true;
  }

  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
    // ctx.font = scale + scale + "px Times New Roman";

    // ctx.fillText(this.sticker, x - scale - brush.brushSize, y);
    // console.log("here");
    // ctx.translate(x, y);
    // ctx.fillText(this.sticker, x - scale - brush.brushSize, y);
    // ctx.resetTransform();
  }
}

let sticker = new StickerCommand(0, 0, "😎");
// Step 7: Show paint brush size next to the mouse
const scale = 10;

class ToolCommand {
  x;
  y;
  constructor(x: number = begPoint, y: number = begPoint) {
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = (brush.brushSize * scale).toString() + "px Times New Roman";
    ctx.fillStyle = "blue";
    if (!isDrawing) {
      ctx.fillText(".", this.x - scale - brush.brushSize, this.y);
    }
  }
}
let tool: ToolCommand = new ToolCommand();

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
let s1Placed = false;
let isOutOfScreen = true;
canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  // Go through all the lines and display them
  let count = 0;
  undoList.forEach((m: MarkerCommand) => {
    m.display(canvas.getContext("2d")!, undoBrushList[count]);
    count++;
  });
});

canvas.addEventListener("tool-moved", () => {
  // If off screen, remove tool indicator, if one screen, update size
  if (!isOutOfScreen) {
    tool.draw(canvas.getContext("2d")!);
    sticker.draw(canvas.getContext("2d")!);
  } else {
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseenter", (e) => {
  isOutOfScreen = false;
  if (s1) {
    sticker = new StickerCommand(e.offsetX, e.offsetY, "😎");
  } else {
    tool = new ToolCommand(e.offsetX, e.offsetY);
  }
  canvas.dispatchEvent(new Event("tool-moved"));
});

canvas.addEventListener("mouseout", () => {
  isOutOfScreen = true;
  canvas.dispatchEvent(new Event("tool-moved"));
});

// sticker.addEventListener("click", function (event) { });

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  // console.log(e.offsetX, e.offsetY, sticker.x, sticker.y);
  if (s1Placed && e.offsetX >= sticker.x - 20 && e.offsetY >= sticker.y - 20) {
    // sticker.drag(e.offsetX, e.offsetY);
    // s1Placed = false;
    s1 = true;
  }
  if (s1 && !s1Placed) {
    sticker = new StickerCommand(e.offsetX, e.offsetY, "😎");
    s1Placed = true;
    s1 = false;
  } else {
    isDrawing = true;
    marker = new MarkerCommand(e.offsetX, e.offsetY);
    undoList.push(marker);
    undoBrushList.push(brush.brushSize);
  }

  canvas.dispatchEvent(new Event("tool-moved"));
});

canvas.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    marker.drag(e.offsetX, e.offsetY);
  }
  if (s1) {
    // sticker = new StickerCommand(e.offsetX, e.offsetY, "😎");
    sticker.drag(e.offsetX, e.offsetY);
    s1Placed = false;
  } else {
    tool = new ToolCommand(e.offsetX, e.offsetY);
  }
  canvas.dispatchEvent(new Event("drawing-changed"));

  canvas.dispatchEvent(new Event("tool-moved"));
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
row3.appendChild(brushSize);
row4.appendChild(sticker1);
row4.appendChild(sticker2);
row4.appendChild(sticker3);
board.appendChild(row1);
board.appendChild(row2);
board.appendChild(row3);
board.appendChild(row4);
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
