
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

type TessellationTranslation = {
  translation: Translation;
  numUnits: number;
}

interface Tessellation {
  unit: Shape[];
  translationsX: TessellationTranslation;
  translationsY: TessellationTranslation;
}

function drawTesselation(tessellation: Tessellation, startCoord: Point) {
  // Draw each translation numUnits times using dynamic programming: do the first translation, 
  // then move on to the second one, where you apply on each unit of the first translation the second one, and so on.
  // This way you can draw the whole tessellation without recursion.

  for (let numUnitsX = 0; numUnitsX < tessellation.translationsX.numUnits; ++numUnitsX) {
    // Draw the first translation
    for (const unit of tessellation.unit) {
      const translatedUnit = translateShape(unit, {
        x: startCoord.x + numUnitsX * tessellation.translationsX.translation.x,
        y: startCoord.y + numUnitsX * tessellation.translationsX.translation.y,
      });
      drawShape(translatedUnit);
    }
    for (let numUnitsY = 0; numUnitsY < tessellation.translationsY.numUnits; numUnitsY++) {
      // Draw the second translation
      for (const unit of tessellation.unit) {
        const translatedUnit = translateShape(unit, {
          x: startCoord.x + numUnitsX * tessellation.translationsX.translation.x + numUnitsY * tessellation.translationsY.translation.x,
          y: startCoord.y + numUnitsX * tessellation.translationsX.translation.y + numUnitsY * tessellation.translationsY.translation.y,
        });
        drawShape(translatedUnit);
      }
    }
  }

  


}

/*function drawUnit(tessellation: Tessellation, drawnUnits: number, coords: Point) {
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
}*/



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
        { x: 50, y:50 * Math.sqrt(3) },
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
}