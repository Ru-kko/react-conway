import { CHUNK_SIZE } from "./conf";

export class ConwayGameError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConwayGameError";
  }
}

export class OutOfBoundsError extends ConwayGameError {
  constructor(x: number, y: number) {
    super(`Coordinates (${x}, ${y}) are out of bounds.`);
    this.name = "OutOfBoundsError";
  }
}

export class GameSizeError extends ConwayGameError {
  constructor(size: number, endSize?: number) {
    if (endSize) { 
      super(`The game size must be between ${size} and ${endSize}.`);
      this.name = "GameSizeError";
      return;
    }
    super(`Invalid game size: ${size}. Size must be divisible by ${CHUNK_SIZE}.`);
    this.name = "InvalidSizeError";
  }
}