import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Sticker Sketchpad";

// Defining magic numbers
const begPoint = 0;
const nonNeg = 1;

// Title
document.title = gameName;
const header = document.createElement("h1");
header.innerHTML = gameName;
const board = document.createElement("div");
const row1 = document.createElement("div");
const row2 = document.createElement("div");
const row3 = document.createElement("div");
const row4 = document.createElement("div");

// Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext("2d")!;
ctx.fillStyle = "white";
ctx.fillRect(begPoint, begPoint, canvas.width, canvas.height);

// Step 9
interface Sticker {
  value: string;
}

const availableStickers: Sticker[] = [
  {
    value: "😎",
  },
  {
    value: "👀",
  },
  {
    value: "🧐",
  },
  {
    value: "custom",
  },
];

// Step 8

class StickerCommand {
  x;
  y;
  sticker;
  onScreen;
  constructor(x: number = begPoint, y: number = begPoint, sticker: string) {
    this.x = x;
    this.y = y;
    this.sticker = sticker;
    this.onScreen = true;
  }
  draw(ctx: CanvasRenderingContext2D) {
    if (!this.onScreen) {
      ctx.fillStyle = "rgba(255, 0, 0, 0)";
    } else {
      ctx.fillStyle = "rgba(255, 0, 0, 1)";
    }
    ctx.font = scale + scale + "px Times New Roman";
    ctx.fillText(this.sticker, this.x - scale - scale, this.y);
    // s1Placed = true;
  }

  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
// Add buttons
// const buttons: HTMLButtonElement[] = [];
const actualStickers: StickerCommand[] = []; // [stick1, stick2, stick3];

// stickerCount = 0;
availableStickers.forEach((obj, i) => {
  // Buttons
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    if (obj.value == "custom") {
      const text = prompt("Custom sticker text", "🧽")!;
      customSticker(text);
      return;
    }
    sSelected[i] = true;
  });
  button.innerHTML = obj.value;
  row4.appendChild(button);

  // Stickers
  const stick = new StickerCommand(begPoint, begPoint, obj.value);
  actualStickers.push(stick);
  canvas.dispatchEvent(new Event("tool-moved")), false;
});

// Custom sticker
function customSticker(text: string) {
  availableStickers.push({ value: text });
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    sSelected[availableStickers.length - 1] = true;
    canvas.dispatchEvent(new Event("tool-moved")), false;
  });
  button.innerHTML = text;
  app.append(button);
  const stick = new StickerCommand(begPoint, begPoint, text);
  actualStickers.push(stick);
}
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
// let sOnScreen = [false, false, false];
function undoRedo(
  l1: (MarkerCommand | StickerCommand)[],
  l2: (MarkerCommand | StickerCommand)[],
  l3: number[],
  l4: number[]
) {
  if (l1.length) {
    l2.push(l1.pop()!);
    l4.push(l3.pop()!);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
}

// Clear button
const clearButton = document.createElement("button");
clearButton.innerHTML = "Clear";
clearButton.addEventListener("click", () => clearCanvas(), false);
// Undo button
const undoButton = document.createElement("button");
undoButton.innerHTML = "Undo";
undoButton.addEventListener("click", () => {
  const save = undoList[undoList.length - 1];
  if (save instanceof StickerCommand) {
    save.onScreen = false;
  }
  undoRedo(undoList, redoList, undoBrushList, redoBrushList), false;
});
// Redo button
const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.addEventListener("click", () => {
  const save = redoList[redoList.length - 1];
  if (save instanceof StickerCommand) {
    save.onScreen = true;
  }
  undoRedo(redoList, undoList, redoBrushList, undoBrushList), false;
});
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
// draw brush size on screen
const brushSize = document.createElement("div");
brushSize.innerHTML = "Brush Size: " + brush.brushSize;

// STICKERS
const sSelected: boolean[] = [];
const sPlaced: boolean[] = [];

function clearCanvas() {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  undoList = [];
  redoList = [];
  isDrawing = false;
  brush.resetBrush();
  undoBrushList = [];
  redoBrushList = [];
  for (let i = begPoint; i < actualStickers.length; i++) {
    actualStickers[i].onScreen = false;
  }
}

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
  draw(ctx: CanvasRenderingContext2D, brushSize: number) {
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

let undoList: (MarkerCommand | StickerCommand)[] = [];
let redoList: (MarkerCommand | StickerCommand)[] = [];
let marker: MarkerCommand = new MarkerCommand();
let undoBrushList: number[] = [];
let redoBrushList: number[] = [];
let isDrawing = false;
// let s1Placed = false;
let isOutOfScreen = true;
canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  // Go through all the lines and draw them
  let count = begPoint;
  undoList.forEach((m) => {
    m.draw(canvas.getContext("2d")!, undoBrushList[count]);
    count++;
  });
});

canvas.addEventListener("tool-moved", () => {
  // If off screen, remove tool indicator, if on screen, update size
  if (!isOutOfScreen) {
    tool.draw(canvas.getContext("2d")!);
    for (let i = begPoint; i < sSelected.length; i++) {
      actualStickers[i].draw(canvas.getContext("2d")!);
    }
    // canvas.dispatchEvent(new Event("drawing-changed"));
    // sticker.draw(canvas.getContext("2d")!);
  } else {
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

canvas.addEventListener("mouseenter", (e) => {
  isOutOfScreen = false;
  let check = false;
  for (let i = begPoint; i < sSelected.length; i++) {
    if (sSelected[i]) {
      actualStickers[i].drag(e.offsetX, e.offsetY);
      check = true;
    }
  }
  if (!check) {
    tool = new ToolCommand(e.offsetX, e.offsetY);
  }
  canvas.dispatchEvent(new Event("tool-moved"));
});

canvas.addEventListener("mouseout", () => {
  isOutOfScreen = true;
});

// Gets original coords and starts the drawing
canvas.addEventListener("mousedown", (e) => {
  let check = false;
  for (let i = begPoint; i < sSelected.length; i++) {
    if (
      sPlaced[i] &&
      actualStickers[i].onScreen &&
      ((e.offsetX >= actualStickers[i].x - scale - scale &&
        e.offsetX <= actualStickers[i].x + scale + scale &&
        e.offsetY <= actualStickers[i].y + scale + scale &&
        e.offsetY >= actualStickers[i].y - scale - scale) ||
        sSelected[i])
    ) {
      sSelected[i] = true;
      actualStickers[i].onScreen = true;
    }
  }
  for (let i = begPoint; i < sSelected.length; i++) {
    if (sSelected[i] && !sPlaced[i]) {
      actualStickers[i].drag(e.offsetX, e.offsetY);
      sPlaced[i] = true;
      sSelected[i] = false;
      actualStickers[i].onScreen = true;

      check = true;
      undoList.push(actualStickers[i]);
      undoBrushList.push(brush.brushSize);
      break;
    }
  }

  if (!check) {
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
  let check = false;
  for (let i = begPoint; i < sSelected.length; i++) {
    if (sSelected[i]) {
      actualStickers[i].drag(e.offsetX, e.offsetY);
      sPlaced[i] = false;
      check = true;
    }
  }
  if (!check) {
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
// buttons.forEach((b) => {
//   row4.appendChild(b);
// });
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
