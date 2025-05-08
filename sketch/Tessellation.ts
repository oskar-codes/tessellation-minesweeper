
type Shape = {
  points: Point[],
  color: [number, number, number],
};

type Translation = {
  x: number;
  y: number;
  angle: number;
}

function translateShape(shape: Shape, translation: Point): Shape {
  // Translate the shape by the given translation vector
  return {
    points: shape.points.map(point => ({
      x: point.x + translation.x,
      y: point.y + translation.y,
    })),
    color: shape.color,
  };
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

const TESSELLATIONS: Record<string, Tessellation> = {
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
          { x: 150, y: - 50 * Math.sqrt(3) },
          { x: 200, y: 0 },
        ],
        color: [0, 0, 255],
      },
      {
        points: [
          { x: 150, y: - 50 * Math.sqrt(3) },
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
}
