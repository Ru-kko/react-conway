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
  constructor(size: number) {
    super(`Invalid game size: ${size}. Size must be divisible by ${CHUNK_SIZE}.`);
    this.name = "InvalidSizeError";
  }
}