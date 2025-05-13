var ColorHelper = (function () {
    function ColorHelper() {
    }
    ColorHelper.getColorVector = function (c) {
        return createVector(red(c), green(c), blue(c));
    };
    ColorHelper.rainbowColorBase = function () {
        return [
            color('red'),
            color('orange'),
            color('yellow'),
            color('green'),
            color(38, 58, 150),
            color('indigo'),
            color('violet')
        ];
    };
    ColorHelper.getColorsArray = function (total, baseColorArray) {
        var _this = this;
        if (baseColorArray === void 0) { baseColorArray = null; }
        if (baseColorArray == null) {
            baseColorArray = ColorHelper.rainbowColorBase();
        }
        var rainbowColors = baseColorArray.map(function (x) { return _this.getColorVector(x); });
        ;
        var colours = new Array();
        for (var i = 0; i < total; i++) {
            var colorPosition = i / total;
            var scaledColorPosition = colorPosition * (rainbowColors.length - 1);
            var colorIndex = Math.floor(scaledColorPosition);
            var colorPercentage = scaledColorPosition - colorIndex;
            var nameColor = this.getColorByPercentage(rainbowColors[colorIndex], rainbowColors[colorIndex + 1], colorPercentage);
            colours.push(color(nameColor.x, nameColor.y, nameColor.z));
        }
        return colours;
    };
    ColorHelper.getColorByPercentage = function (firstColor, secondColor, percentage) {
        var firstColorCopy = firstColor.copy();
        var secondColorCopy = secondColor.copy();
        var deltaColor = secondColorCopy.sub(firstColorCopy);
        var scaledDeltaColor = deltaColor.mult(percentage);
        return firstColorCopy.add(scaledDeltaColor);
    };
    return ColorHelper;
}());
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var MinesweeperBoard = (function () {
    function MinesweeperBoard(tessellation, startCoord, numUnitsX, numUnitsY, mineCount, scale) {
        if (scale === void 0) { scale = 1; }
        this.tiles = [];
        this.revealedCount = 0;
        this.flagCount = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.minesPlaced = false;
        this.mineCount = mineCount;
        this.scale = scale;
        this.generateTiles(tessellation, startCoord, numUnitsX, numUnitsY);
        this.centerBoard();
        this.calculateNeighborMineCounts();
    }
    MinesweeperBoard.prototype.generateTiles = function (tessellation, startCoord, numUnitsX, numUnitsY) {
        var _this = this;
        var id = 0;
        var _loop_1 = function (x) {
            var _loop_2 = function (y) {
                for (var _i = 0, _a = tessellation.unit; _i < _a.length; _i++) {
                    var unit = _a[_i];
                    var scaledPoints = unit.points.map(function (p) { return ({
                        x: p.x * _this.scale,
                        y: p.y * _this.scale
                    }); });
                    var translatedShape = {
                        points: scaledPoints.map(function (point) { return ({
                            x: startCoord.x + x * tessellation.translationsX.translation.x * _this.scale + y * tessellation.translationsY.translation.x * _this.scale + point.x,
                            y: startCoord.y + x * tessellation.translationsX.translation.y * _this.scale + y * tessellation.translationsY.translation.y * _this.scale + point.y,
                        }); }),
                        color: unit.color,
                    };
                    this_1.tiles.push({
                        id: id++,
                        shape: translatedShape,
                        state: 'hidden',
                        isMine: false,
                        neighborMineCount: 0,
                        neighbors: [],
                    });
                }
            };
            for (var y = 0; y < numUnitsY; ++y) {
                _loop_2(y);
            }
        };
        var this_1 = this;
        for (var x = 0; x < numUnitsX; ++x) {
            _loop_1(x);
        }
        this.calculateNeighbors();
    };
    MinesweeperBoard.prototype.calculateNeighbors = function () {
        var threshold = 1e-2;
        for (var i = 0; i < this.tiles.length; ++i) {
            var tileA = this.tiles[i];
            var _loop_3 = function (j) {
                if (i === j)
                    return "continue";
                var tileB = this_2.tiles[j];
                if (tileA.shape.points.some(function (pa) { return tileB.shape.points.some(function (pb) { return Math.abs(pa.x - pb.x) < threshold && Math.abs(pa.y - pb.y) < threshold; }); })) {
                    tileA.neighbors.push(j);
                }
            };
            var this_2 = this;
            for (var j = 0; j < this.tiles.length; ++j) {
                _loop_3(j);
            }
        }
    };
    MinesweeperBoard.prototype.placeMinesAfterFirstClick = function (firstClickIdx) {
        if (this.minesPlaced)
            return;
        this.minesPlaced = true;
        var firstTile = this.tiles[firstClickIdx];
        var safeIndices = __spreadArrays([firstClickIdx], firstTile.neighbors);
        var placed = 0;
        while (placed < this.mineCount) {
            var idx = Math.floor(Math.random() * this.tiles.length);
            if (!this.tiles[idx].isMine && !safeIndices.includes(idx)) {
                this.tiles[idx].isMine = true;
                placed++;
            }
        }
        this.calculateNeighborMineCounts();
    };
    MinesweeperBoard.prototype.revealTile = function (idx) {
        var tile = this.tiles[idx];
        if (tile.state !== 'hidden' || this.gameOver)
            return;
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
            for (var _i = 0, _a = tile.neighbors; _i < _a.length; _i++) {
                var nIdx = _a[_i];
                this.revealTile(nIdx);
            }
        }
        this.checkWin();
    };
    MinesweeperBoard.prototype.flagTile = function (idx) {
        var tile = this.tiles[idx];
        if (tile.state === 'hidden') {
            tile.state = 'flagged';
            this.flagCount++;
        }
        else if (tile.state === 'flagged') {
            tile.state = 'hidden';
            this.flagCount--;
        }
        this.checkWin();
    };
    MinesweeperBoard.prototype.checkWin = function () {
        if (this.gameOver)
            return;
        if (this.tiles.every(function (tile) { return (tile.isMine && tile.state === 'flagged') || (!tile.isMine && tile.state === 'revealed'); })) {
            this.gameWon = true;
            this.gameOver = true;
        }
    };
    MinesweeperBoard.prototype.centerBoard = function () {
        var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            for (var _b = 0, _c = tile.shape.points; _b < _c.length; _b++) {
                var p = _c[_b];
                if (p.x < minX)
                    minX = p.x;
                if (p.y < minY)
                    minY = p.y;
                if (p.x > maxX)
                    maxX = p.x;
                if (p.y > maxY)
                    maxY = p.y;
            }
        }
        var boardWidth = maxX - minX;
        var boardHeight = maxY - minY;
        var offsetX = width / 2 - (minX + boardWidth / 2);
        var offsetY = height / 2 - (minY + boardHeight / 2);
        for (var _d = 0, _e = this.tiles; _d < _e.length; _d++) {
            var tile = _e[_d];
            for (var _f = 0, _g = tile.shape.points; _f < _g.length; _f++) {
                var p = _g[_f];
                p.x += offsetX;
                p.y += offsetY;
            }
        }
    };
    MinesweeperBoard.prototype.calculateNeighborMineCounts = function () {
        var _this = this;
        for (var _i = 0, _a = this.tiles; _i < _a.length; _i++) {
            var tile = _a[_i];
            tile.neighborMineCount = tile.neighbors.reduce(function (acc, nIdx) { return acc + (_this.tiles[nIdx].isMine ? 1 : 0); }, 0);
        }
    };
    return MinesweeperBoard;
}());
var PolygonHelper = (function () {
    function PolygonHelper() {
    }
    PolygonHelper.draw = function (numberOfSides, width) {
        push();
        var angle = TWO_PI / numberOfSides;
        var radius = width / 2;
        beginShape();
        for (var a = 0; a < TWO_PI; a += angle) {
            var sx = cos(a) * radius;
            var sy = sin(a) * radius;
            vertex(sx, sy);
        }
        endShape(CLOSE);
        pop();
    };
    return PolygonHelper;
}());
function drawShape(shape) {
    beginShape();
    fill(shape.color);
    for (var _i = 0, _a = shape.points; _i < _a.length; _i++) {
        var point_1 = _a[_i];
        vertex(point_1.x, point_1.y);
    }
    endShape(CLOSE);
}
function drawTile(tile, showMines) {
    if (showMines === void 0) { showMines = false; }
    if (tile.state === 'revealed') {
        fill(220);
    }
    else if (tile.state === 'flagged') {
        fill(255, 0, 0);
    }
    else {
        fill(180);
    }
    stroke(0);
    beginShape();
    for (var _i = 0, _a = tile.shape.points; _i < _a.length; _i++) {
        var point_2 = _a[_i];
        vertex(point_2.x, point_2.y);
    }
    endShape(CLOSE);
    if (tile.state === 'revealed') {
        if (tile.isMine) {
            fill(0);
            ellipse(tile.shape.points.reduce(function (acc, p) { return acc + p.x; }, 0) / tile.shape.points.length, tile.shape.points.reduce(function (acc, p) { return acc + p.y; }, 0) / tile.shape.points.length, 20, 20);
        }
        else if (tile.neighborMineCount > 0) {
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(18);
            text(tile.neighborMineCount, tile.shape.points.reduce(function (acc, p) { return acc + p.x; }, 0) / tile.shape.points.length, tile.shape.points.reduce(function (acc, p) { return acc + p.y; }, 0) / tile.shape.points.length);
        }
    }
    else if (tile.state === 'flagged') {
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(18);
        text('🚩', tile.shape.points.reduce(function (acc, p) { return acc + p.x; }, 0) / tile.shape.points.length, tile.shape.points.reduce(function (acc, p) { return acc + p.y; }, 0) / tile.shape.points.length);
    }
    else if (showMines && tile.isMine) {
        fill(0);
        ellipse(tile.shape.points.reduce(function (acc, p) { return acc + p.x; }, 0) / tile.shape.points.length, tile.shape.points.reduce(function (acc, p) { return acc + p.y; }, 0) / tile.shape.points.length, 20, 20);
    }
}
function translateShape(shape, translation) {
    return {
        points: shape.points.map(function (point) { return ({
            x: point.x + translation.x,
            y: point.y + translation.y,
        }); }),
        color: shape.color,
    };
}
function drawTesselation(tessellation, startCoord) {
    for (var numUnitsX = 0; numUnitsX < tessellation.translationsX.numUnits; ++numUnitsX) {
        for (var _i = 0, _a = tessellation.unit; _i < _a.length; _i++) {
            var unit = _a[_i];
            var translatedUnit = translateShape(unit, {
                x: startCoord.x + numUnitsX * tessellation.translationsX.translation.x,
                y: startCoord.y + numUnitsX * tessellation.translationsX.translation.y,
            });
            drawShape(translatedUnit);
        }
        for (var numUnitsY = 0; numUnitsY < tessellation.translationsY.numUnits; numUnitsY++) {
            for (var _b = 0, _c = tessellation.unit; _b < _c.length; _b++) {
                var unit = _c[_b];
                var translatedUnit = translateShape(unit, {
                    x: startCoord.x + numUnitsX * tessellation.translationsX.translation.x + numUnitsY * tessellation.translationsY.translation.x,
                    y: startCoord.y + numUnitsX * tessellation.translationsX.translation.y + numUnitsY * tessellation.translationsY.translation.y,
                });
                drawShape(translatedUnit);
            }
        }
    }
}
var TESSELLATIONS = {
    DEFAULT: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 100, y: 0 },
                    { x: 100, y: 100 },
                    { x: 0, y: 100 },
                ],
                color: [255, 0, 0],
            }
        ],
        translationsX: {
            translation: { x: 100, y: 0, angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 50, y: 100, angle: 0 },
            numUnits: 10,
        },
    },
    TRIANGLE: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 100, y: 0 },
                    { x: 50, y: 50 * Math.sqrt(3) },
                ],
                color: [0, 255, 0],
            },
            {
                points: [
                    { x: 100, y: 0 },
                    { x: 150, y: 50 * Math.sqrt(3) },
                    { x: 50, y: 50 * Math.sqrt(3) },
                ],
                color: [0, 0, 255],
            }
        ],
        translationsX: {
            translation: { x: 100, y: 0, angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 50, y: 50 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
    },
    HEXAGON: {
        unit: [
            {
                points: [
                    { x: -100, y: 0 },
                    { x: -50, y: -50 * Math.sqrt(3) },
                    { x: 50, y: -50 * Math.sqrt(3) },
                    { x: 100, y: 0 },
                    { x: 50, y: 50 * Math.sqrt(3) },
                    { x: -50, y: 50 * Math.sqrt(3) }
                ],
                color: [255, 0, 0],
            }
        ],
        translationsX: {
            translation: { x: 150, y: 50 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 0, y: 100 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
    },
    SEMI_REGULAR_HEX_TRIANGLE: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 50, y: -50 * Math.sqrt(3) },
                    { x: 150, y: -50 * Math.sqrt(3) },
                    { x: 200, y: 0 },
                    { x: 150, y: 50 * Math.sqrt(3) },
                    { x: 50, y: 50 * Math.sqrt(3) }
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 150, y: -50 * Math.sqrt(3) },
                    { x: 250, y: -50 * Math.sqrt(3) },
                    { x: 200, y: 0 },
                ],
                color: [0, 255, 0],
            },
            {
                points: [
                    { x: 150, y: 50 * Math.sqrt(3) },
                    { x: 250, y: 50 * Math.sqrt(3) },
                    { x: 200, y: 0 },
                ],
                color: [0, 0, 255],
            }
        ],
        translationsX: {
            translation: { x: 200, y: 0, angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 100, y: 100 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
    },
    SEMI_REGULAR_OCTOGON_SQUARE: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 50 * Math.sqrt(2), y: -50 * Math.sqrt(2) },
                    { x: 100 + 50 * Math.sqrt(2), y: -50 * Math.sqrt(2) },
                    { x: 100 + 100 * Math.sqrt(2), y: 0 },
                    { x: 100 + 100 * Math.sqrt(2), y: 100 },
                    { x: 100 + 50 * Math.sqrt(2), y: 100 + 50 * Math.sqrt(2) },
                    { x: 50 * Math.sqrt(2), y: 100 + 50 * Math.sqrt(2) },
                    { x: 0, y: 100 },
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 100 + 100 * Math.sqrt(2), y: 0 },
                    { x: 200 + 100 * Math.sqrt(2), y: 0 },
                    { x: 200 + 100 * Math.sqrt(2), y: 100 },
                    { x: 100 + 100 * Math.sqrt(2), y: 100 },
                ],
                color: [0, 255, 0],
            }
        ],
        translationsX: {
            translation: { x: 100 + 50 * Math.sqrt(2), y: -(100 + 50 * Math.sqrt(2)), angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 100 + 50 * Math.sqrt(2), y: 100 + 50 * Math.sqrt(2), angle: 0 },
            numUnits: 10,
        },
    },
    SEMI_REGULAR_TWO_DIFF_SQUARES: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 200, y: 0 },
                    { x: 200, y: 200 },
                    { x: 0, y: 200 },
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 200, y: 0 },
                    { x: 300, y: 0 },
                    { x: 300, y: 100 },
                    { x: 200, y: 100 },
                ],
                color: [0, 255, 0],
            }
        ],
        translationsX: {
            translation: { x: 100, y: -200, angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 200, y: 100, angle: 0 },
            numUnits: 10,
        },
    },
    SEMI_REGULAR_HEX_TRIANGLES_NON_E2E: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 100, y: -100 * Math.sqrt(3) },
                    { x: 300, y: -100 * Math.sqrt(3) },
                    { x: 400, y: 0 },
                    { x: 300, y: 100 * Math.sqrt(3) },
                    { x: 100, y: 100 * Math.sqrt(3) }
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 300, y: -100 * Math.sqrt(3) },
                    { x: 400, y: -100 * Math.sqrt(3) },
                    { x: 350, y: -50 * Math.sqrt(3) },
                ],
                color: [0, 255, 0],
            },
            {
                points: [
                    { x: 400, y: 0 },
                    { x: 450, y: 50 * Math.sqrt(3) },
                    { x: 350, y: 50 * Math.sqrt(3) },
                ],
                color: [0, 0, 255],
            }
        ],
        translationsX: {
            translation: { x: 100, y: -200 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 250, y: 150 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
    },
    SEMI_REGULAR_SURROUNDED_HEXAGON: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 100, y: 0 },
                    { x: 100, y: 100 },
                    { x: 0, y: 100 },
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 100, y: 100 },
                    { x: 0, y: 100 },
                    { x: 50, y: 100 + 50 * Math.sqrt(3) },
                ],
                color: [0, 255, 0],
            },
            {
                points: [
                    { x: 100, y: 100 },
                    { x: 50, y: 100 + 50 * Math.sqrt(3) },
                    { x: 50 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 100 + 50 * Math.sqrt(3), y: 150 },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 50 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 100 + 50 * Math.sqrt(3), y: 150 },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 100 + 50 * Math.sqrt(3), y: 150 },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 150 + 100 * Math.sqrt(3), y: 100 + 50 * Math.sqrt(3) },
                    { x: 100 + 100 * Math.sqrt(3), y: 100 },
                ],
                color: [0, 255, 255],
            },
            {
                points: [
                    { x: 100, y: 0 },
                    { x: 100, y: 100 },
                    { x: 100 + 50 * Math.sqrt(3), y: 150 },
                    { x: 100 + 100 * Math.sqrt(3), y: 100 },
                    { x: 100 + 100 * Math.sqrt(3), y: 0 },
                    { x: 100 + 50 * Math.sqrt(3), y: -50 }
                ],
                color: [255, 0, 255],
            }
        ],
        translationsX: {
            translation: { x: 100 + 100 * Math.sqrt(3), y: 0, angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 50 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
    },
    HEXAGONE_SQUARE_TRIANGLE_2_REG: {
        unit: [
            {
                points: [
                    { x: 0, y: 0 },
                    { x: 100, y: 0 },
                    { x: 100, y: 100 },
                    { x: 0, y: 100 },
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 0, y: 100 },
                    { x: 100, y: 100 },
                    { x: 150, y: 100 + 50 * Math.sqrt(3) },
                    { x: 100, y: 100 + 100 * Math.sqrt(3) },
                    { x: 0, y: 100 + 100 * Math.sqrt(3) },
                    { x: -50, y: 100 + 50 * Math.sqrt(3) }
                ],
                color: [0, 255, 0],
            },
            {
                points: [
                    { x: 100, y: 100 + 100 * Math.sqrt(3) },
                    { x: 150, y: 100 + 50 * Math.sqrt(3) },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 100 + 50 * Math.sqrt(3), y: 150 + 100 * Math.sqrt(3) },
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 100 + 50 * Math.sqrt(3), y: 150 + 100 * Math.sqrt(3) },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 250 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 300 + 50 * Math.sqrt(3), y: 150 + 100 * Math.sqrt(3) },
                    { x: 250 + 50 * Math.sqrt(3), y: 150 + 150 * Math.sqrt(3) },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 150 * Math.sqrt(3) }
                ],
                color: [0, 255, 0],
            },
            {
                points: [
                    { x: 300 + 50 * Math.sqrt(3), y: 150 + 100 * Math.sqrt(3) },
                    { x: 250 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 250 + 100 * Math.sqrt(3), y: 100 + 50 * Math.sqrt(3) },
                    { x: 300 + 100 * Math.sqrt(3), y: 100 + 100 * Math.sqrt(3) },
                ],
                color: [255, 0, 0],
            },
            {
                points: [
                    { x: 100, y: 0 },
                    { x: 200, y: 0 },
                    { x: 200, y: 100 },
                    { x: 100, y: 100 },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 100, y: 100 },
                    { x: 200, y: 100 },
                    { x: 150, y: 100 + 50 * Math.sqrt(3) },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 150, y: 100 + 50 * Math.sqrt(3) },
                    { x: 200, y: 100 },
                    { x: 200 + 50 * Math.sqrt(3), y: 150 },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 200 + 50 * Math.sqrt(3), y: 150 },
                    { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 250 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 250 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                    { x: 200 + 50 * Math.sqrt(3), y: 150 },
                    { x: 200 + 100 * Math.sqrt(3), y: 100 },
                    { x: 250 + 100 * Math.sqrt(3), y: 100 + 50 * Math.sqrt(3) },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 200 + 100 * Math.sqrt(3), y: 100 },
                    { x: 250 + 100 * Math.sqrt(3), y: 100 + 50 * Math.sqrt(3) },
                    { x: 300 + 100 * Math.sqrt(3), y: 100 },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 200 + 100 * Math.sqrt(3), y: 100 },
                    { x: 300 + 100 * Math.sqrt(3), y: 100 },
                    { x: 300 + 100 * Math.sqrt(3), y: 0 },
                    { x: 200 + 100 * Math.sqrt(3), y: 0 },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 300 + 100 * Math.sqrt(3), y: 0 },
                    { x: 200 + 100 * Math.sqrt(3), y: 0 },
                    { x: 250 + 100 * Math.sqrt(3), y: -50 * Math.sqrt(3) },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 200 + 100 * Math.sqrt(3), y: 0 },
                    { x: 250 + 100 * Math.sqrt(3), y: -50 * Math.sqrt(3) },
                    { x: 250 + 50 * Math.sqrt(3), y: -50 - 50 * Math.sqrt(3) },
                    { x: 200 + 50 * Math.sqrt(3), y: -50 },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 250 + 50 * Math.sqrt(3), y: -50 - 50 * Math.sqrt(3) },
                    { x: 200 + 50 * Math.sqrt(3), y: -50 },
                    { x: 150 + 50 * Math.sqrt(3), y: -50 - 50 * Math.sqrt(3) },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 200 + 50 * Math.sqrt(3), y: -50 },
                    { x: 150 + 50 * Math.sqrt(3), y: -50 - 50 * Math.sqrt(3) },
                    { x: 150, y: -50 * Math.sqrt(3) },
                    { x: 200, y: 0 },
                ],
                color: [0, 0, 255],
            },
            {
                points: [
                    { x: 150, y: -50 * Math.sqrt(3) },
                    { x: 200, y: 0 },
                    { x: 100, y: 0 },
                ],
                color: [255, 255, 0],
            },
            {
                points: [
                    { x: 200, y: 0 },
                    { x: 200, y: 100 },
                    { x: 200 + 50 * Math.sqrt(3), y: 150 },
                    { x: 200 + 100 * Math.sqrt(3), y: 100 },
                    { x: 200 + 100 * Math.sqrt(3), y: 0 },
                    { x: 200 + 50 * Math.sqrt(3), y: -50 }
                ],
                color: [0, 255, 255],
            }
        ],
        translationsX: {
            translation: { x: 300 + 100 * Math.sqrt(3), y: 0, angle: 0 },
            numUnits: 10,
        },
        translationsY: {
            translation: { x: 150 + 50 * Math.sqrt(3), y: 150 + 150 * Math.sqrt(3), angle: 0 },
            numUnits: 10,
        },
    },
};
var Difficulty;
(function (Difficulty) {
    Difficulty["EASY"] = "Easy";
    Difficulty["INTERMEDIATE"] = "Intermediate";
    Difficulty["HARD"] = "Hard";
})(Difficulty || (Difficulty = {}));
var numberOfShapesControl;
var image_lebron;
var board;
var playAgainButton;
var buttonArea;
var difficultyButtonArea;
var easyButton;
var intermediateButton;
var hardButton;
var tessellation = TESSELLATIONS.HEXAGONE_SQUARE_TRIANGLE_2_REG;
var currentDifficulty = {
    numUnitsX: 3,
    numUnitsY: 3,
    mineCount: 12
};
function setup() {
    var _a;
    console.log("🚀 - Setup initialized - P5 is running");
    image_lebron = loadImage("resources/lebronjames.jpeg");
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
    (_a = document.querySelector('canvas')) === null || _a === void 0 ? void 0 : _a.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
    board = new MinesweeperBoard(tessellation, { x: 0, y: 0 }, currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount, 0.5);
    difficultyButtonArea = createDiv('');
    difficultyButtonArea.position(width - 200, 20);
    difficultyButtonArea.style('background-color', 'rgba(255, 255, 255, 0.8)');
    difficultyButtonArea.style('padding', '10px');
    difficultyButtonArea.style('border-radius', '5px');
    easyButton = createButton(Difficulty.EASY);
    easyButton.parent(difficultyButtonArea);
    easyButton.style('font-size', '16px');
    easyButton.style('padding', '8px 16px');
    easyButton.style('background-color', '#4CAF50');
    easyButton.style('color', 'white');
    easyButton.style('border', 'none');
    easyButton.style('border-radius', '5px');
    easyButton.mousePressed(function () {
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
    intermediateButton.mousePressed(function () {
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
    hardButton.mousePressed(function () {
        currentDifficulty = { numUnitsX: 4, numUnitsY: 4, mineCount: 20 };
        resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount);
    });
    buttonArea = createDiv('');
    buttonArea.position(width - 200, height - 100);
    buttonArea.style('background-color', 'rgba(255, 255, 255, 0.8)');
    buttonArea.style('padding', '10px');
    buttonArea.style('border-radius', '5px');
    playAgainButton = createButton('Play Again');
    playAgainButton.parent(buttonArea);
    playAgainButton.style('font-size', '18px');
    playAgainButton.style('padding', '10px 20px');
    playAgainButton.style('background-color', '#4CAF50');
    playAgainButton.style('color', 'white');
    playAgainButton.style('border', 'none');
    playAgainButton.style('border-radius', '5px');
    playAgainButton.mousePressed(function () { return resetGame(currentDifficulty.numUnitsX, currentDifficulty.numUnitsY, currentDifficulty.mineCount); });
    playAgainButton.hide();
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    difficultyButtonArea.position(width - 200, 20);
    buttonArea.position(width - 200, height - 100);
}
function draw() {
    background(image_lebron, 150);
    stroke(0, 0, 0);
    for (var _i = 0, _a = board.tiles; _i < _a.length; _i++) {
        var tile = _a[_i];
        drawTile(tile, board.gameOver);
    }
    if (board.gameOver) {
        fill(board.gameWon ? 'green' : 'red');
        textAlign(CENTER, CENTER);
        textSize(32);
        text(board.gameWon ? 'You Win!' : 'Game Over', width / 2, 40);
        buttonArea.show();
        playAgainButton.show();
    }
    else {
        buttonArea.hide();
        playAgainButton.hide();
    }
}
function mousePressed() {
    if (board.gameOver)
        return;
    for (var i = 0; i < board.tiles.length; ++i) {
        var tile = board.tiles[i];
        if (pointInPolygon({ x: mouseX, y: mouseY }, tile.shape.points)) {
            if (mouseButton === LEFT) {
                board.revealTile(i);
            }
            else if (mouseButton === RIGHT) {
                board.flagTile(i);
            }
            break;
        }
    }
}
function pointInPolygon(point, vs) {
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;
        var intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi + 1e-10) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
}
function resetGame(numUnitsX, numUnitsY, mineCount) {
    board = new MinesweeperBoard(tessellation, { x: 0, y: 0 }, numUnitsX, numUnitsY, mineCount, 0.5);
    playAgainButton.hide();
}
//# sourceMappingURL=build.js.map