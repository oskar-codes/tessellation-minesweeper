// Types for tile state
type TileState = 'hidden' | 'revealed' | 'flagged';

interface Tile {
  id: number;
  shape: Shape;
  state: TileState;
  isMine: boolean;
  neighborMineCount: number;
  neighbors: number[]; // indices of neighboring tiles
}

class MinesweeperBoard {
  tiles: Tile[] = [];
  mineCount: number;
  revealedCount: number = 0;
  flagCount: number = 0;
  gameOver: boolean = false;
  gameWon: boolean = false;
  scale: number;
  minesPlaced: boolean = false;
  hoveredTileIndex: number | null = null;

  constructor(
    tessellation: Tessellation,
    startCoord: Point,
    numUnitsX: number,
    numUnitsY: number,
    scale: number = 1
  ) {
    this.scale = scale;
    this.hoveredTileIndex = null;
    this.generateTiles(tessellation, startCoord, numUnitsX, numUnitsY);
    this.mineCount = Math.floor(this.tiles.length * 0.15); // 15% of tiles are mines
    this.centerBoard();
    this.calculateNeighborMineCounts();
  }

  private generateTiles(tessellation: Tessellation, startCoord: Point, numUnitsX: number, numUnitsY: number) {
    let id = 0;
    for (let x = 0; x < numUnitsX; ++x) {
      for (let y = 0; y < numUnitsY; ++y) {
        for (const unit of tessellation.unit) {
          // Apply scaling to each point
          const scaledPoints = unit.points.map(p => ({
            x: p.x * this.scale,
            y: p.y * this.scale
          }));
          const translatedShape = {
            points: scaledPoints.map(point => ({
              x: startCoord.x + x * tessellation.translationsX.translation.x * this.scale + y * tessellation.translationsY.translation.x * this.scale + point.x,
              y: startCoord.y + x * tessellation.translationsX.translation.y * this.scale + y * tessellation.translationsY.translation.y * this.scale + point.y,
            })),
            color: unit.color,
          };
          this.tiles.push({
            id: id++,
            shape: translatedShape,
            state: 'hidden',
            isMine: false,
            neighborMineCount: 0,
            neighbors: [],
          });
        }
      }
    }
    // After all tiles are created, calculate neighbors
    this.calculateNeighbors();
  }

  private calculateNeighbors() {
    // For each tile, find neighbors by shared vertices (approximate for now)
    const threshold = 1e-2;
    for (let i = 0; i < this.tiles.length; ++i) {
      const tileA = this.tiles[i];
      for (let j = 0; j < this.tiles.length; ++j) {
        if (i === j) continue;
        const tileB = this.tiles[j];
        // If they share at least one vertex, consider them neighbors
        if (tileA.shape.points.some(pa => tileB.shape.points.some(pb => Math.abs(pa.x - pb.x) < threshold && Math.abs(pa.y - pb.y) < threshold))) {
          tileA.neighbors.push(j);
        }
      }
    }
  }

  private placeMinesAfterFirstClick(firstClickIdx: number) {
    if (this.minesPlaced) return;
    this.minesPlaced = true;
    const firstTile = this.tiles[firstClickIdx];
    const safeIndices = [firstClickIdx, ...firstTile.neighbors];
    let placed = 0;
    while (placed < this.mineCount) {
      const idx = Math.floor(Math.random() * this.tiles.length);
      if (!this.tiles[idx].isMine && !safeIndices.includes(idx)) {
        this.tiles[idx].isMine = true;
        placed++;
      }
    }
    this.calculateNeighborMineCounts();
  }

  revealTile(idx: number) {
    const tile = this.tiles[idx];
    if (tile.state !== 'hidden' || this.gameOver) return;
    if (!this.minesPlaced) {
      this.placeMinesAfterFirstClick(idx);
    }
    tile.state = 'revealed';
    this.revealedCount++;
    if (tile.isMine) {
      this.gameOver = true;
      return;
    }
    if (tile.neighborMineCount === 0) {
      // Reveal all neighbors recursively
      for (const nIdx of tile.neighbors) {
        this.revealTile(nIdx);
      }
    }
    this.checkWin();
  }

  flagTile(idx: number) {
    const tile = this.tiles[idx];
    if (tile.state === 'hidden') {
      tile.state = 'flagged';
      this.flagCount++;
    } else if (tile.state === 'flagged') {
      tile.state = 'hidden';
      this.flagCount--;
    }
    this.checkWin();
  }

  checkWin() {
    if (this.gameOver) return;
    if (this.tiles.every(tile => (tile.isMine && tile.state === 'flagged') || (!tile.isMine && tile.state === 'revealed'))) {
      this.gameWon = true;
      this.gameOver = true;
    }
  }

  private centerBoard() {
    // Compute bounding box
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const tile of this.tiles) {
      for (const p of tile.shape.points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
    }
    const boardWidth = maxX - minX;
    const boardHeight = maxY - minY;
    const offsetX = width / 2 - (minX + boardWidth / 2);
    const offsetY = height / 2 - (minY + boardHeight / 2);
    for (const tile of this.tiles) {
      for (const p of tile.shape.points) {
        p.x += offsetX;
        p.y += offsetY;
      }
    }
  }

  private calculateNeighborMineCounts() {
    for (const tile of this.tiles) {
      tile.neighborMineCount = tile.neighbors.reduce((acc, nIdx) => acc + (this.tiles[nIdx].isMine ? 1 : 0), 0);
    }
  }

  setHoveredTile(point: Point): void {
    this.hoveredTileIndex = null;
    for (let i = 0; i < this.tiles.length; ++i) {
      if (pointInPolygon(point, this.tiles[i].shape.points)) {
        this.hoveredTileIndex = i;
        break;
      }
    }
  }

  isTileHighlighted(tileIndex: number): boolean {
    if (this.hoveredTileIndex === null) return false;
    if (tileIndex === this.hoveredTileIndex) return true;
    return this.tiles[this.hoveredTileIndex].neighbors.includes(tileIndex);
  }
} 