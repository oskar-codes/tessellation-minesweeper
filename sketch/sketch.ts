// Define difficulty modes
enum Difficulty {
  EASY = 'Easy',
  INTERMEDIATE = 'Intermediate',
  HARD = 'Hard'
}

// GLOBAL VARS & TYPES
let numberOfShapesControl: p5.Element;
let image_lebron: p5.Image;
let board: MinesweeperBoard;
let playAgainButton: p5.Element;
let buttonArea: p5.Element;
let difficultyButtonArea: p5.Element;
let easyButton: p5.Element;
let intermediateButton: p5.Element;
let hardButton: p5.Element;

const tessellation = TESSELLATIONS.HEXAGONE_SQUARE_TRIANGLE_2_REG;

// Track current difficulty settings
let currentDifficulty = {
  numUnitsX: 3,
  numUnitsY: 3,
  mineCount: 12
};

// Ran once
function setup() {
  console.log("🚀 - Setup initialized - P5 is running");

  image_lebron = loadImage("resources/lebronjames.jpeg");

  createCanvas(windowWidth, windowHeight)
  rectMode(CENTER).noFill().frameRate(30);

  // Prevent context menu on canvas
  document.querySelector('canvas')?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Initialize a Minesweeper board in intermediate mode by default
  board = new MinesweeperBoard(
    tessellation,
    { x: 0, y: 0 },
    currentDifficulty.numUnitsX,
    currentDifficulty.numUnitsY,
    currentDifficulty.mineCount,
    0.5
  );

  // Create a button area for difficulty buttons in the top right
  difficultyButtonArea = createDiv('');
  difficultyButtonArea.position(width - 200, 20);
  difficultyButtonArea.style('background-color', 'rgba(255, 255, 255, 0.8)');
  difficultyButtonArea.style('padding', '10px');
  difficultyButtonArea.style('border-radius', '5px');

  // Create difficulty buttons
  easyButton = createButton(Difficulty.EASY);
  easyButton.parent(difficultyButtonArea);
  easyButton.style('font-size', '16px');
  easyButton.style('padding', '8px 16px');
  easyButton.style('background-color', '#4CAF50');
  easyButton.style('color', 'white');
  easyButton.style('border', 'none');
  easyButton.style('border-radius', '5px');
  easyButton.mousePressed(() => {
    currentDifficulty = { numUnitsX: 2, numUnitsY: 2, mineCount: 6 };
    resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount);
  });

  intermediateButton = createButton(Difficulty.INTERMEDIATE);
  intermediateButton.parent(difficultyButtonArea);
  intermediateButton.style('font-size', '16px');
  intermediateButton.style('padding', '8px 16px');
  intermediateButton.style('background-color', '#FFC107');
  intermediateButton.style('color', 'black');
  intermediateButton.style('border', 'none');
  intermediateButton.style('border-radius', '5px');
  intermediateButton.mousePressed(() => {
    currentDifficulty = { numUnitsX: 3, numUnitsY: 3, mineCount: 12 };
    resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount);
  });

  hardButton = createButton(Difficulty.HARD);
  hardButton.parent(difficultyButtonArea);
  hardButton.style('font-size', '16px');
  hardButton.style('padding', '8px 16px');
  hardButton.style('background-color', '#F44336');
  hardButton.style('color', 'white');
  hardButton.style('border', 'none');
  hardButton.style('border-radius', '5px');
  hardButton.mousePressed(() => {
    currentDifficulty = { numUnitsX: 4, numUnitsY: 4, mineCount: 20 };
    resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount);
  });

  // Create a button area for the 'Play Again' button in the bottom right
  buttonArea = createDiv('');
  buttonArea.position(width - 200, height - 100);
  buttonArea.style('background-color', 'rgba(255, 255, 255, 0.8)');
  buttonArea.style('padding', '10px');
  buttonArea.style('border-radius', '5px');

  // Create a 'Play Again' button (initially hidden)
  playAgainButton = createButton('Play Again');
  playAgainButton.parent(buttonArea);
  playAgainButton.style('font-size', '18px');
  playAgainButton.style('padding', '10px 20px');
  playAgainButton.style('background-color', '#4CAF50');
  playAgainButton.style('color', 'white');
  playAgainButton.style('border', 'none');
  playAgainButton.style('border-radius', '5px');
  playAgainButton.mousePressed(() => resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount));
  playAgainButton.hide();
}

// Resizes the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  difficultyButtonArea.position(width - 200, 20);
  buttonArea.position(width - 200, height - 100);
}

// Ran every frame
function draw() {
  background(image_lebron, 150);

  stroke(0, 0, 0);
  // Draw all tiles
  for (const tile of board.tiles) {
    drawTile(tile, board.gameOver);
  }

  // Show win/lose message
  if (board.gameOver) {
    fill(board.gameWon ? 'green' : 'red');
    textAlign(CENTER, CENTER);
    textSize(32);
    text(board.gameWon ? 'You Win!' : 'Game Over', width / 2, 40);
    buttonArea.show();
    playAgainButton.show();
  } else {
    buttonArea.hide();
    playAgainButton.hide();
  }
}

function mousePressed() {
  if (board.gameOver) return;
  // Find which tile was clicked
  for (let i = 0; i < board.tiles.length; ++i) {
    const tile = board.tiles[i];
    if (pointInPolygon({ x: mouseX, y: mouseY }, tile.shape.points)) {
      if (mouseButton === LEFT) {
        board.revealTile(i);
      } else if (mouseButton === RIGHT) {
        board.flagTile(i);
      }
      break;
    }
  }
}

// Helper: point-in-polygon test
function pointInPolygon(point: Point, vs: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].x, yi = vs[i].y;
    const xj = vs[j].x, yj = vs[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 1e-10) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

// Reset the game with specified board size and mine count
function resetGame(numUnitsX: number, numUnitsY: number, mineCount: number) {
  board = new MinesweeperBoard(
    tessellation,
    { x: 0, y: 0 },
    numUnitsX, numUnitsY,
    mineCount,
    0.5
  );
  playAgainButton.hide();
}