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
}