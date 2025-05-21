// Define difficulty modes
enum Difficulty {
  EASY = 'Easy',
  INTERMEDIATE = 'Intermediate',
  HARD = 'Hard'
}

// Define game states
enum GameState {
  MAIN_MENU = 'MAIN_MENU',
  LEVEL_SELECT = 'LEVEL_SELECT',
  PLAYING = 'PLAYING'
}

// GLOBAL VARS & TYPES
let currentGameState: GameState = GameState.MAIN_MENU;
let numberOfShapesControl: p5.Element;
let image_lebron: p5.Image;
let board: MinesweeperBoard;
let playAgainButton: p5.Element;
let buttonArea: p5.Element;
let difficultyButtonArea: p5.Element;
let easyButton: p5.Element;
let intermediateButton: p5.Element;
let hardButton: p5.Element;
let mainMenuArea: p5.Element;
let startGameButton: p5.Element;
let levelSelectArea: p5.Element;
let backToMenuButton: p5.Element;
let suppressNextClick = false;
let tessellation = TESSELLATIONS.DEFAULT;
let levelPreviews: p5.Graphics[] = [];
let levelPreviewImages: p5.Element[] = [];

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

  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER).noFill().frameRate(30);

  // Prevent context menu on canvas
  document.querySelector('canvas')?.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Create main menu area
  mainMenuArea = createDiv('');
  mainMenuArea.position(width / 2 - 150, height / 2 - 100);
  mainMenuArea.style('background-color', 'rgba(255, 255, 255, 0.9)');
  mainMenuArea.style('padding', '20px');
  mainMenuArea.style('border-radius', '10px');
  mainMenuArea.style('width', '300px');
  mainMenuArea.style('text-align', 'center');
  mainMenuArea.style('z-index', '1000');

  // Create title
  const title = createElement('h1', 'Tessellationsweeper');
  title.parent(mainMenuArea);
  title.style('color', '#333');
  title.style('margin-bottom', '30px');

  // Create start game button
  startGameButton = createButton('Start Game');
  startGameButton.parent(mainMenuArea);
  startGameButton.style('font-size', '18px');
  startGameButton.style('padding', '10px 20px');
  startGameButton.style('background-color', '#4CAF50');
  startGameButton.style('color', 'white');
  startGameButton.style('border', 'none');
  startGameButton.style('border-radius', '5px');
  startGameButton.style('margin-bottom', '20px');
  startGameButton.mousePressed(() => {
    mainMenuArea.hide();
    currentGameState = GameState.LEVEL_SELECT;
    levelSelectArea.style('display', 'flex');
    backToMenuButton.show();
  });

  // Create level select area
  levelSelectArea = createDiv('');
  levelSelectArea.style('position', 'absolute');
  levelSelectArea.style('top', '50%');
  levelSelectArea.style('left', '50%');
  levelSelectArea.style('transform', 'translate(-50%, -50%)');
  levelSelectArea.style('background-color', 'rgba(255, 255, 255, 0.9)');
  levelSelectArea.style('padding', '20px');
  levelSelectArea.style('border-radius', '10px');
  levelSelectArea.style('width', '80%');
  levelSelectArea.style('text-align', 'center');
  levelSelectArea.style('z-index', '1000');
  levelSelectArea.style('display', 'flex');
  levelSelectArea.style('flex-direction', 'row');
  levelSelectArea.style('flex-wrap', 'wrap');
  levelSelectArea.style('justify-content', 'center');
  levelSelectArea.hide();

  // Create back button
  backToMenuButton = createButton('Back to Menu');
  backToMenuButton.parent(document.body);
  backToMenuButton.style('font-size', '16px');
  backToMenuButton.style('padding', '8px 16px');
  backToMenuButton.style('background-color', '#666');
  backToMenuButton.style('color', 'white');
  backToMenuButton.style('border', 'none');
  backToMenuButton.style('border-radius', '5px');
  backToMenuButton.style('margin-bottom', '20px');
  backToMenuButton.style('position', 'absolute');
  backToMenuButton.style('top', '20px');
  backToMenuButton.style('left', '20px');
  backToMenuButton.mousePressed(() => {
    
    if (currentGameState === GameState.PLAYING) {
      board = undefined;
      currentGameState = GameState.LEVEL_SELECT;
      difficultyButtonArea.hide();
      levelSelectArea.style('display', 'flex');
    } else if (currentGameState === GameState.LEVEL_SELECT) {
      levelSelectArea.style('display', 'none');
      mainMenuArea.show();
      currentGameState = GameState.MAIN_MENU;
      backToMenuButton.hide();
    }

  });
  backToMenuButton.hide();

  
  // Remove any previous preview image if it exists
  // if (previewImg) {
    //   previewImg.remove();
    //   previewImg = undefined;
    // }
  
  let i = 1;
  for (const [_, ts] of Object.entries(TESSELLATIONS)) {
    // Create level card
    const levelCard = createDiv('');
    levelCard.parent(levelSelectArea);
    levelCard.style('background-color', 'white');
    levelCard.style('border-radius', '8px');
    levelCard.style('padding', '15px');
    levelCard.style('margin', '10px');
    levelCard.style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)');
    levelCard.style('cursor', 'pointer');
    levelCard.style('transition', 'transform 0.2s');
    levelCard.mouseOver(() => {
      levelCard.style('transform', 'scale(1.02)');
    });
    levelCard.mouseOut(() => {
      levelCard.style('transform', 'scale(1)');
    });
    levelCard.mousePressed(() => {
      levelSelectArea.hide();
      currentGameState = GameState.PLAYING;
      suppressNextClick = true;
      tessellation = ts;
      initializeGame();
    });
    // Create a separate graphics buffer for the preview
    const pg = createGraphics(180, 180);
    pg.background(255);
    
    // Draw the tessellation preview
    const board = new MinesweeperBoard(
      ts,
      { x: 90, y: 90 }, // Center in 180x180
      2, 2, // Small board for preview
      0,
      0.1 // Slightly larger scale for preview
    );
  
    // Draw the preview in the graphics buffer
    for (const tile of board.tiles) {
      pg.fill(220);
      pg.stroke(0);
      pg.strokeWeight(1);
      pg.beginShape();
      for (const point of tile.shape.points) {
        pg.vertex(point.x - windowWidth / 2 + 90, point.y - windowHeight / 2 + 90);
      }
      pg.endShape(CLOSE);
    }

    levelPreviews.push(pg);
    // Convert the graphics buffer to a base64 image and add it to the card
    const previewImg = createImg((pg.elt as HTMLCanvasElement).toDataURL(), 'Tessellation Preview');
    previewImg.parent(levelCard);
    previewImg.style('display', 'block');
    previewImg.style('margin', '0 auto 10px auto');
    previewImg.style('width', '180px');
    previewImg.style('height', '180px');
    previewImg.style('background', 'white');
    previewImg.style('border-radius', '6px');
    previewImg.style('box-shadow', '0 1px 2px rgba(0,0,0,0.08)');

    levelPreviewImages.push(previewImg);

    // Add level number
    const levelNumber = createElement('h3', `Level ${i}`);
    levelNumber.parent(levelCard);
    levelNumber.style('margin', '10px 0 0 0');
    levelNumber.style('color', '#333');

    i++;
  }




  // Create a button area for difficulty buttons in the top right
  difficultyButtonArea = createDiv('');
  difficultyButtonArea.position(width - 200, 20);
  difficultyButtonArea.style('background-color', 'rgba(255, 255, 255, 0.8)');
  difficultyButtonArea.style('padding', '10px');
  difficultyButtonArea.style('border-radius', '5px');
  difficultyButtonArea.hide();

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
  buttonArea.hide(); // Initially hidden

  // Create a 'Play Again' button (initially hidden)
  playAgainButton = createButton('Play Again');
  playAgainButton.parent(buttonArea);
  playAgainButton.style('font-size', '18px');
  playAgainButton.style('padding', '10px 20px');
  playAgainButton.style('background-color', '#4CAF50');
  playAgainButton.style('color', 'white');
  playAgainButton.style('border', 'none');
  playAgainButton.style('border-radius', '5px');
  playAgainButton.mousePressed(() => {
    resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount);
  });
  playAgainButton.hide();
}

// Initialize the game with default settings
function initializeGame() {
  // Create a new board instance
  board = new MinesweeperBoard(
    tessellation,
    { x: 0, y: 0 },
    currentDifficulty.numUnitsX,
    currentDifficulty.numUnitsY,
    currentDifficulty.mineCount,
    0.5
  );
  difficultyButtonArea.show();
}

// Resizes the canvas when the window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (currentGameState === GameState.MAIN_MENU) {
    mainMenuArea.position(width / 2 - 150, height / 2 - 100);
  }
  difficultyButtonArea.position(width - 200, 20);
  buttonArea.position(width - 200, height - 100);
}

// Ran every frame
function draw() {
  // Draw the background image
  background(image_lebron, 150);
  
  if (currentGameState === GameState.PLAYING && board) {
    // Draw all tiles first
    for (const tile of board.tiles) {
      drawTile(tile, board.gameOver);
    }
    
    // Draw highlights on top
    for (const tile of board.tiles) {
      drawTileHighlight(tile);
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
}

function mousePressed() {
  if (suppressNextClick) {
    suppressNextClick = false;
    return;
  }
  if (currentGameState === GameState.MAIN_MENU || currentGameState === GameState.LEVEL_SELECT) {
    // Only handle menu interactions
    return;
  }
  
  if (currentGameState === GameState.PLAYING && board) {
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
}

function mouseMoved() {
  if (currentGameState === GameState.MAIN_MENU) {
    // Only handle main menu interactions
    return;
  }
  
  if (currentGameState === GameState.PLAYING) {
    if (board.gameOver) return;
    board.setHoveredTile({ x: mouseX, y: mouseY });
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