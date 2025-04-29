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
function drawShape(points) {
    beginShape();
    for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
        var point_1 = points_1[_i];
        vertex(point_1.x, point_1.y);
    }
    endShape(CLOSE);
}
function translateShape(shape, translation) {
    return shape.map(function (point) { return ({
        x: point.x + translation.x,
        y: point.y + translation.y,
    }); });
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
            [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ]
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
            [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 50, y: 50 * Math.sqrt(3) },
            ],
            [
                { x: 100, y: 0 },
                { x: 150, y: 50 * Math.sqrt(3) },
                { x: 50, y: 50 * Math.sqrt(3) },
            ],
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
            [
                { x: -100, y: 0 },
                { x: -50, y: -50 * Math.sqrt(3) },
                { x: 50, y: -50 * Math.sqrt(3) },
                { x: 100, y: 0 },
                { x: 50, y: 50 * Math.sqrt(3) },
                { x: -50, y: 50 * Math.sqrt(3) }
            ],
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
            [
                { x: 0, y: 0 },
                { x: 50, y: -50 * Math.sqrt(3) },
                { x: 150, y: -50 * Math.sqrt(3) },
                { x: 200, y: 0 },
                { x: 150, y: 50 * Math.sqrt(3) },
                { x: 50, y: 50 * Math.sqrt(3) }
            ],
            [
                { x: 150, y: -50 * Math.sqrt(3) },
                { x: 250, y: -50 * Math.sqrt(3) },
                { x: 200, y: 0 },
            ],
            [
                { x: 150, y: 50 * Math.sqrt(3) },
                { x: 250, y: 50 * Math.sqrt(3) },
                { x: 200, y: 0 },
            ]
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
            [
                { x: 0, y: 0 },
                { x: 50 * Math.sqrt(2), y: -50 * Math.sqrt(2) },
                { x: 100 + 50 * Math.sqrt(2), y: -50 * Math.sqrt(2) },
                { x: 100 + 100 * Math.sqrt(2), y: 0 },
                { x: 100 + 100 * Math.sqrt(2), y: 100 },
                { x: 100 + 50 * Math.sqrt(2), y: 100 + 50 * Math.sqrt(2) },
                { x: 50 * Math.sqrt(2), y: 100 + 50 * Math.sqrt(2) },
                { x: 0, y: 100 },
            ],
            [
                { x: 100 + 100 * Math.sqrt(2), y: 0 },
                { x: 200 + 100 * Math.sqrt(2), y: 0 },
                { x: 200 + 100 * Math.sqrt(2), y: 100 },
                { x: 100 + 100 * Math.sqrt(2), y: 100 },
            ],
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
            [
                { x: 0, y: 0 },
                { x: 200, y: 0 },
                { x: 200, y: 200 },
                { x: 0, y: 200 },
            ],
            [
                { x: 200, y: 0 },
                { x: 300, y: 0 },
                { x: 300, y: 100 },
                { x: 200, y: 100 },
            ]
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
            [
                { x: 0, y: 0 },
                { x: 100, y: -100 * Math.sqrt(3) },
                { x: 300, y: -100 * Math.sqrt(3) },
                { x: 400, y: 0 },
                { x: 300, y: 100 * Math.sqrt(3) },
                { x: 100, y: 100 * Math.sqrt(3) }
            ],
            [
                { x: 300, y: -100 * Math.sqrt(3) },
                { x: 400, y: -100 * Math.sqrt(3) },
                { x: 350, y: -50 * Math.sqrt(3) },
            ],
            [
                { x: 400, y: 0 },
                { x: 450, y: 50 * Math.sqrt(3) },
                { x: 350, y: 50 * Math.sqrt(3) },
            ]
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
            [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 },
            ],
            [
                { x: 100, y: 100 },
                { x: 0, y: 100 },
                { x: 50, y: 100 + 50 * Math.sqrt(3) },
            ],
            [
                { x: 100, y: 100 },
                { x: 50, y: 100 + 50 * Math.sqrt(3) },
                { x: 50 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                { x: 100 + 50 * Math.sqrt(3), y: 150 },
            ],
            [
                { x: 50 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                { x: 100 + 50 * Math.sqrt(3), y: 150 },
                { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
            ],
            [
                { x: 100 + 50 * Math.sqrt(3), y: 150 },
                { x: 150 + 50 * Math.sqrt(3), y: 150 + 50 * Math.sqrt(3) },
                { x: 150 + 100 * Math.sqrt(3), y: 100 + 50 * Math.sqrt(3) },
                { x: 100 + 100 * Math.sqrt(3), y: 100 },
            ],
            [
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 100 + 50 * Math.sqrt(3), y: 150 },
                { x: 100 + 100 * Math.sqrt(3), y: 100 },
                { x: 100 + 100 * Math.sqrt(3), y: 0 },
                { x: 100 + 50 * Math.sqrt(3), y: -50 }
            ]
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
};
var numberOfShapesControl;
var image_lebron;
function setup() {
    console.log("🚀 - Setup initialized - P5 is running");
    image_lebron = loadImage("resources/lebronjames.jpeg");
    createCanvas(windowWidth, windowHeight);
    rectMode(CENTER).noFill().frameRate(30);
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(image_lebron, 150);
    fill(255, 0, 0);
    stroke(0, 0, 0);
    drawTesselation(TESSELLATIONS.SEMI_REGULAR_SURROUNDED_HEXAGON, { x: 50, y: 50 });
}
//# sourceMappingURL=build.js.map