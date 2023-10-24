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
const row5 = document.createElement("div");
const row6 = document.createElement("div");

// Canvas
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
canvas.width = 256;
canvas.height = 256;
let ctx = canvas.getContext("2d")!;
ctx.fillStyle = "white";
ctx.fillRect(begPoint, begPoint, canvas.width, canvas.height);

// Step 12
let color = `rgba(0,0,0,1)`;
const rangeRed = document.getElementById("rangeRed") as HTMLInputElement;
const rangeRedVal = document.getElementById("rangeRedVal")!;

rangeRed.addEventListener("input", function () {
  rangeRedVal.textContent = this.value;
  color = `rgba(${rangeRedVal.textContent}, ${rangeGreenVal.textContent}, ${rangeBlueVal.textContent}, 1)`;
});

const rangeGreen = document.getElementById("rangeGreen") as HTMLInputElement;
const rangeGreenVal = document.getElementById("rangeGreenVal")!;

rangeGreen.addEventListener("input", function () {
  rangeGreenVal.textContent = this.value;
  color = `rgba(${rangeRedVal.textContent}, ${rangeGreenVal.textContent}, ${rangeBlueVal.textContent}, 1)`;
});

const rangeBlue = document.getElementById("rangeBlue") as HTMLInputElement;
const rangeBlueVal = document.getElementById("rangeBlueVal")!;

rangeBlue.addEventListener("input", function () {
  rangeBlueVal.textContent = this.value;
  color = `rgba(${rangeRedVal.textContent}, ${rangeGreenVal.textContent}, ${rangeBlueVal.textContent}, 1)`;
});

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
      ctx.fillStyle = "rgba(0, 0, 0, 0)";
    } else {
      ctx.fillStyle = color;
    }
    ctx.font = scale + scale + "px Times New Roman";
    ctx.fillText(this.sticker, this.x - scale - scale, this.y);
  }

  drag(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
// Adding stickers and buttons
const actualStickers: StickerCommand[] = [];
availableStickers.forEach((obj, i) => {
  customSticker(obj.value, i);
});

function customSticker(text: string, i: number) {
  const button = document.createElement("button");
  button.addEventListener("click", () => {
    if (text == "custom") {
      const t = prompt("Custom sticker text", "⚠️")!;
      availableStickers.push({ value: t });
      customSticker(t, availableStickers.length - 1);
      return;
    }
    sSelected.fill(false);
    sSelected[i] = true;
    stick.onScreen = true;
  });
  button.innerHTML = text;
  row5.append(button);
  const stick = new StickerCommand(begPoint, begPoint, text);
  actualStickers.push(stick);
  canvas.dispatchEvent(new Event("tool-moved")), false;
}

// Step 6: I took it a step further and made even more options for marker sizes. I believe it's the same logic as requested on the slides.
const intialSize = 3;
class BrushSizeCommand {
  brushSize: number;
  constructor() {
    this.brushSize = intialSize;
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
    sSelected.fill(false);
    brushSize.innerHTML = "Brush Size: " + this.brushSize;
  }

  // Reset the brush to intial state
  resetBrush() {
    this.brushSize = intialSize;
    brushSize.innerHTML = "Brush Size: " + this.brushSize;
  }
}
// Undo or Redo based on the values of l1 and l2
function undoRedo(
  l1: (MarkerCommand | StickerCommand)[],
  l2: (MarkerCommand | StickerCommand)[],
  l3: number[],
  l4: number[],
  color1: string[],
  color2: string[]
) {
  if (l1.length) {
    l2.push(l1.pop()!);
    l4.push(l3.pop()!);
    color2.push(color1.pop()!);
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
  undoRedo(
    undoList,
    redoList,
    undoBrushList,
    redoBrushList,
    undoColorList,
    redoColorList
  ),
    false;
});
// Redo button
const redoButton = document.createElement("button");
redoButton.innerHTML = "Redo";
redoButton.addEventListener("click", () => {
  const save = redoList[redoList.length - 1];
  if (save instanceof StickerCommand) {
    save.onScreen = true;
  }
  undoRedo(
    redoList,
    undoList,
    redoBrushList,
    undoBrushList,
    redoColorList,
    undoColorList
  ),
    false;
});

// step 10
// export button
const exportButton = document.createElement("button");
exportButton.innerHTML = "Export";
exportButton.addEventListener("click", () => {
  const canvasExport = document.getElementById("canvas") as HTMLCanvasElement;
  canvasExport.width = 1024;
  canvasExport.height = 1024;
  ctx = canvasExport.getContext("2d")!;
  const scaleUp = 4;
  ctx.resetTransform();
  ctx.scale(scaleUp, scaleUp);
  canvasExport.dispatchEvent(new Event("drawing-changed"));
  const anchor = document.createElement("a");
  anchor.href = canvasExport.toDataURL("image/png");
  anchor.download = "sketchpad.png";
  anchor.click();
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  canvas.width = 256;
  canvas.height = 256;
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
  undoColorList = [];
  redoColorList = [];

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
    if (!isDrawing) {
      if (isOutOfScreen) {
        ctx.fillStyle = "rgba(255, 255, 255, 0)";
      } else {
        ctx.fillStyle = color;
      }
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
  draw(ctx: CanvasRenderingContext2D, brushSize: number, colorList: string) {
    // Go through all the points in the line and make a path between them
    ctx.lineWidth = brushSize;
    ctx.beginPath();
    ctx.moveTo(this.currentLine[begPoint].x, this.currentLine[begPoint].y);
    for (const p of this.currentLine) {
      ctx.lineTo(p.x, p.y);
    }
    ctx.strokeStyle = colorList;
    ctx.stroke();
  }
}

let undoList: (MarkerCommand | StickerCommand)[] = [];
let redoList: (MarkerCommand | StickerCommand)[] = [];
let marker: MarkerCommand = new MarkerCommand();
let undoBrushList: number[] = [];
let redoBrushList: number[] = [];
let undoColorList: string[] = [];
let redoColorList: string[] = [];
let isDrawing = false;
// let s1Placed = false;
let isOutOfScreen = true;
canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(begPoint, begPoint, canvas.width, canvas.height);
  // Go through all the lines and draw them
  let count = begPoint;
  // console.log(undoList);
  undoList.forEach((m) => {
    m.draw(
      canvas.getContext("2d")!,
      undoBrushList[count],
      undoColorList[count]
    );
    count++;
  });
});

canvas.addEventListener("tool-moved", () => {
  // If off screen, remove tool indicator, if on screen, update size
  let isTool = true;
  if (!isOutOfScreen) {
    for (let i = begPoint; i < sSelected.length; i++) {
      if (actualStickers[i].onScreen) {
        isTool = false;
      }
      actualStickers[i].draw(canvas.getContext("2d")!);
    }
  } else {
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
  if (isTool) {
    tool.draw(canvas.getContext("2d")!);
  }
});

canvas.addEventListener("mouseenter", (e) => {
  isOutOfScreen = false;
  let check = false;
  for (let i = begPoint; i < sSelected.length; i++) {
    if (sSelected[i]) {
      actualStickers[i] = new StickerCommand(
        e.offsetX,
        e.offsetY,
        availableStickers[i].value
      ); //.drag(e.offsetX, e.offsetY);
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
  for (let i = begPoint; i < sSelected.length; i++) {
    sSelected[i] = false;
    actualStickers[i].onScreen = false;
  }
  canvas.dispatchEvent(new Event("tool-moved"));
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
      actualStickers[i] = new StickerCommand(
        e.offsetX,
        e.offsetY,
        availableStickers[i].value
      ); //.drag(e.offsetX, e.offsetY);
      sPlaced[i] = true;
      // sSelected[i] = false;
      actualStickers[i].onScreen = true;

      check = true;
      undoList.push(actualStickers[i]);
      undoBrushList.push(brush.brushSize);
      undoColorList.push(color);
      break;
    }
  }

  if (!check) {
    isDrawing = true;
    marker = new MarkerCommand(e.offsetX, e.offsetY);
    undoList.push(marker);
    undoBrushList.push(brush.brushSize);
    // console.log("current color: ", color);
    undoColorList.push(color);
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
      actualStickers[i] = new StickerCommand(
        e.offsetX,
        e.offsetY,
        availableStickers[i].value
      ); //.drag(e.offsetX, e.offsetY);
      sPlaced[i] = false;
      sSelected[i] = true;
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
board.appendChild(row1);
board.appendChild(row2);
board.appendChild(row3);
board.appendChild(row4);
board.appendChild(row5);
app.append(header);
app.append(board);
app.appendChild(exportButton);

row6.appendChild(rangeRed);
row6.appendChild(rangeRedVal);
row6.appendChild(rangeGreen);
row6.appendChild(rangeGreenVal);
row6.appendChild(rangeBlue);
row6.appendChild(rangeBlueVal);

app.appendChild(row6);

/*
Credits:
- In all steps, used the resources provided on the slides (including the code examples)
- Explained how to use "as HTMLCanvasElement" to not have a problem with the possability of a null canvas
    https://kernhanda.github.io/tutorial-typescript-canvas-drawing/
- Custom events:
    - https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggerin
- Step 5: Used the explanation that Nicholas (the TA) and Adam wrote on the Discord
    */
