// GLOBAL VARS & TYPES
let numberOfShapesControl: p5.Element;
let image_lebron: p5.Image;

// Ran once
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  image_lebron = loadImage("resources/lebronjames.jpeg");

  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);
}

// Resizes the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Ran every frame
function draw() {
  background(image_lebron, 150);

  // const shape = [
  //   { x: 100, y: 100 },
  //   { x: 300, y: 100 },
  //   { x: 200, y: 200 },
  //   { x: 100, y: 200 },
  // ]
  // stroke(0, 0, 0);
  // fill(255, 0, 0);
  // drawShape(shape);

  stroke(0, 0, 0);
  drawTesselation(TESSELLATIONS.DEFAULT, { x: 50, y: 50 });
}