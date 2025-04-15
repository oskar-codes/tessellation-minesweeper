type Point = {
  x: number;
  y: number;
};

// Draw a shape using p5.js functions filled in red
function drawShape(points: Point[]): void {
  beginShape();
  for (const point of points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
}