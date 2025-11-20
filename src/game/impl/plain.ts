import { CellCoordinate, NEIGHBORS } from ".";
import { Chunk, ChunkFactory } from "../chunk";
import { CHUNK_SIZE } from "../conf";
import { GameSizeError, OutOfBoundsError } from "../error";
import { World, WorldFactory } from "../world";
import { WorldType } from "../../constants";

class PlainWorld implements World {
  private chunks: Map<string, Chunk> = new Map();

  constructor(private size: number, chunkData?: Map<string, string>) {
    if (size % CHUNK_SIZE !== 0) throw new GameSizeError(this.size);

    if (!chunkData) {
      return;
    }

    for (const [key, serial] of chunkData.entries()) {
      const [chunkX, chunkY] = key.split(",").map(Number);
      if (
        chunkX < 0 ||
        chunkX >= this.size / CHUNK_SIZE ||
        chunkY < 0 ||
        chunkY >= this.size / CHUNK_SIZE
      ) {
        throw new OutOfBoundsError(chunkX, chunkY);
      }

      this.chunks.set(
        key,
        ChunkFactory.createChunkFromAliveCells(chunkX, chunkY, serial)
      );
    }
  }

  private validate(x: number, y: number): boolean {
    return !(x < 0 || x >= this.size || y < 0 || y >= this.size)
  }

  private getCellCoords(x: number, y: number): CellCoordinate {
    this.validate(x, y);

    const cX = Math.floor(x / CHUNK_SIZE);
    const cY = Math.floor(y / CHUNK_SIZE);
    return {
      chunk: {
        x: cX,
        y: cY,
        key: `${cX},${cY}`,
      },
      local: {
        x: x - cX * CHUNK_SIZE,
        y: y - cY * CHUNK_SIZE,
      },
    };
  }

  getWorldType(): WorldType {
    return WorldType.Plain;
  }

  forEachAliveCell(cb: (x: number, y: number) => void): void {
    for (const chunk of this.chunks.values()) {
      const aliveCells = chunk.getAliveCells();

      for (const cell of aliveCells) {
        cb(cell.real.x, cell.real.y);
      }
    }
  }

  isAlive(x: number, y: number): boolean {
    const { chunk, local } = this.getCellCoords(x, y);
    const c = this.chunks.get(chunk.key);
    return c?.isAlive(local.x, local.y) || false;
  }

  killCell(x: number, y: number): void {
    if (!this.validate(x, y)) return;

    const coords = this.getCellCoords(x, y);
    const chunk = this.chunks.get(coords.chunk.key);
    if (!chunk) return;

    chunk.setCell(coords.local.x, coords.local.y, false);
    if (chunk.isEmpty()) {
      this.chunks.delete(coords.chunk.key);
    }
  }

  reviveCell(x: number, y: number): void {
    if (!this.validate(x, y)) return;

    const coords = this.getCellCoords(x, y);

    let chunk = this.chunks.get(coords.chunk.key);
    if (!chunk) {
      chunk = ChunkFactory.createEmptyChunk(coords.chunk.x, coords.chunk.y);
      this.chunks.set(coords.chunk.key, chunk);
    }

    chunk.setCell(coords.local.x, coords.local.y, true);
  }

  forEachRelevantCell(
    cb: (x: number, y: number, isAlive: boolean, aliveNeighbors: number) => void
  ): void {
    const processed = new Set<string>();

    const add = (x: number, y: number) => {
      if (x < 0 || x >= this.size || y < 0 || y >= this.size) return;

      const key = `${x},${y}`;
      if (processed.has(key)) return;
      processed.add(key);

      let count = NEIGHBORS.reduce((acc, [dx, dy]) => {
        const nX = x + dx;
        const nY = y + dy;
        return acc + (this.isAlive(nX, nY) ? 1 : 0);
      }, 0);

      cb(x, y, this.isAlive(x, y), count);
    };

    this.forEachAliveCell((x, y) => {
      add(x, y);
      for (const [dx, dy] of NEIGHBORS) {
        add(x + dx, y + dy);
      }
    });
  }
}

export class PlainWorldFactory implements WorldFactory<{ size: number }> {
  loadWorld(chunkData: Map<string, string>, options: { size: number }): World {
    return new PlainWorld(options.size, chunkData);
  }

  createNew(options: { size: number }): World {
    return new PlainWorld(options.size);
  }
}
