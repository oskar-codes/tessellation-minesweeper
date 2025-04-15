
type Shape = Point[];
type Translation = {
  x: number;
  y: number;
  angle: number;
}

function translateShape(shape: Shape, translation: Point): Shape {
  // Translate the shape by the given translation vector
  return shape.map(point => ({
    x: point.x + translation.x,
    y: point.y + translation.y,
  }));
}

interface Tessellation {
  numUnits: number;
  unit: Shape[];
  translations: Translation[];
}

function drawTesselation(tessellation: Tessellation, startCoord: Point) {
  // Start by drawing the first unit at startCoord, then recursively draw the rest of the units
  // using the translations provided in the tessellation object, until numUnits is reached.

  drawUnit(tessellation, 0, startCoord);

}

function drawUnit(tessellation: Tessellation, drawnUnits: number, coords: Point) {
  for (const unit of tessellation.unit) {
    drawShape(translateShape(unit, coords));
  }

  if (drawnUnits < tessellation.numUnits) {
    for (const translation of tessellation.translations) {
      const newCoords = {
        x: coords.x + translation.x,
        y: coords.y + translation.y,
      };
      drawUnit(tessellation, drawnUnits + tessellation.translations.length, newCoords);
    }
  }
}



const TESSELLATIONS: Record<string, Tessellation> = {
  DEFAULT: {
    unit: [
      [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ]
    ],
    translations: [
      { x: 0, y: 100, angle: 0 },
      { x: 100, y: 0, angle: 0 },
    ]
  }
}