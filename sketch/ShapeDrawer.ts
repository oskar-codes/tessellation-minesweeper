type Point = {
  x: number;
  y: number;
};

// Draw a shape using p5.js functions filled in red
function drawShape(shape: Shape): void {
  beginShape();
  fill(shape.color);
  for (const point of shape.points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}