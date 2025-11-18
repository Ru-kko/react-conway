import { NEIGHBORS } from ".";
import { GameSizeError, OutOfBoundsError, World } from "..";
import { WorldType } from "../../constants";
import { Chunk, ChunkFactory } from "../chunk";
import { CHUNK_SIZE } from "../conf";

/**
 * A minimal world implementation to make testing easier.
 */
export class UltraSmallWorld implements World {
  private chunk: Chunk;

  constructor(data: string, private size: number = 16) {
    if (size >= CHUNK_SIZE || size < 0) {
      throw new GameSizeError(0, CHUNK_SIZE);
    }

    this.chunk = ChunkFactory.createChunkFromAliveCells(0, 0, data);
    for (const cell of this.chunk.getAliveCells()) {
      if (cell.real.x >= size || cell.real.y >= size) {
        throw new OutOfBoundsError(cell.real.x, cell.real.y);
      }
    }
  }

  getWorldType(): WorldType {
    return WorldType.UltraSmall;
  }

  isAlive(x: number, y: number): boolean {
    return this.chunk.isAlive(x, y);
  }

  killCell(x: number, y: number): void {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      throw new OutOfBoundsError(x, y);
    }
    this.chunk.setCell(x, y, false);
  }

  reviveCell(x: number, y: number): void {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      throw new OutOfBoundsError(x, y);
    }
    this.chunk.setCell(x, y, true);
  }

  forEachAliveCell(cb: (x: number, y: number) => void): void {
    this.chunk.getAliveCells().forEach((cell) => {
      cb(cell.real.x, cell.real.y);
    });
  }

  forEachRelevantCell(
    cb: (x: number, y: number, alive: boolean, neighbors: number) => void
  ): void {
    const processed = new Set<string>();

    const add = (x: number, y: number) => {
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) return;
      const key = `${x},${y}`;
      if (processed.has(key)) return;
      processed.add(key);

      const alive = this.chunk.isAlive(x, y);
      let neighbors = NEIGHBORS.reduce((acc, [dx, dy]) => {
        if (
          dx + x < 0 ||
          dx + x >= this.size ||
          dy + y < 0 ||
          dy + y >= this.size
        ) {
          return acc;
        }
        return acc + (this.chunk.isAlive(x + dx, y + dy) ? 1 : 0);
      }, 0);

      cb(x, y, alive, neighbors);
    };
  }
}
