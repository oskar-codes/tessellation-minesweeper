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

// Draw a tile with Minesweeper state
function drawTile(tile: Tile, showMines: boolean = false) {
  // Draw the shape background based on state
  if (tile.state === 'revealed') {
    fill(220);
  } else if (tile.state === 'flagged') {
    fill(255, 0, 0);
  } else {
    fill(180);
  }
  stroke(0);
  beginShape();
  for (const point of tile.shape.points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);

  // Overlay content
  if (tile.state === 'revealed') {
    if (tile.isMine) {
      fill(0);
      ellipse(
        tile.shape.points.reduce((acc, p) => acc + p.x, 0) / tile.shape.points.length,
        tile.shape.points.reduce((acc, p) => acc + p.y, 0) / tile.shape.points.length,
        20, 20
      );
    } else if (tile.neighborMineCount > 0) {
      fill(0);
      textAlign(CENTER, CENTER);
      textSize(18);
      text(
        tile.neighborMineCount,
        tile.shape.points.reduce((acc, p) => acc + p.x, 0) / tile.shape.points.length,
        tile.shape.points.reduce((acc, p) => acc + p.y, 0) / tile.shape.points.length
      );
    }
  } else if (tile.state === 'flagged') {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(
      '🚩',
      tile.shape.points.reduce((acc, p) => acc + p.x, 0) / tile.shape.points.length,
      tile.shape.points.reduce((acc, p) => acc + p.y, 0) / tile.shape.points.length
    );
  } else if (showMines && tile.isMine) {
    fill(0);
    ellipse(
      tile.shape.points.reduce((acc, p) => acc + p.x, 0) / tile.shape.points.length,
      tile.shape.points.reduce((acc, p) => acc + p.y, 0) / tile.shape.points.length,
      20, 20
    );
  }
}