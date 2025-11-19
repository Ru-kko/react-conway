/**
 * Utility types and exports for game implementations.
 */
export type CellCoordinate = {
  chunk: {
    key: string;
    x: number;
    y: number;
  };
  local: {
    x: number;
    y: number;
  };
};

/**
 * Relative neighbor coordinates.
 */
export const NEIGHBORS = [
  [-1, -1], [0, -1], [1, -1],
  [-1,  0],          [1,  0],
  [-1,  1], [0,  1], [1,  1],
];

export * from "./infinite";
export * from "./plain";
export * from "./torioidal";
export * from "./ultrasmall";