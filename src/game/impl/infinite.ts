import { CellCoordinate, NEIGHBORS } from ".";
import { Chunk, ChunkFactory } from "../chunk";
import { CHUNK_SIZE } from "../conf";
import { World, WorldFactory } from "../world";
import { WorldType } from "../../constants";

class InfiniteWorld implements World {
  private chunks: Map<string, Chunk> = new Map();

  constructor(chunkData?: Map<string, string>) {
    if (!chunkData) {
      return;
    }

    for (const [key, serial] of chunkData.entries()) {
      const [xStr, yStr] = key.split(",");
      const x = parseInt(xStr, 10);
      const y = parseInt(yStr, 10);
      this.chunks.set(
        key,
        ChunkFactory.createChunkFromAliveCells(x, y, serial)
      );
    }
  }

  private getCellCoords(x: number, y: number): CellCoordinate {
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

  private getChunk(x: number, y: number): Chunk | null {
    const { key } = this.getCellCoords(x, y).chunk;
    return this.chunks.get(key) || null;
  }

  private getOrCreateChunk(cx: number, cy: number): Chunk {
    const key = `${cx},${cy}`;
    const chunk = this.chunks.get(key);
    if (chunk) {
      return chunk;
    }

    const newChunk = ChunkFactory.createEmptyChunk(cx, cy);
    this.chunks.set(key, newChunk);
    return newChunk;
  }

  private countAliveNeighbors(x: number, y: number): number {
    const neighbors = NEIGHBORS.map(([dx, dy]) => [x + dx, y + dy]);

    const count = neighbors.reduce((acc, [nx, ny]) => {
      return acc + (this.isAlive(nx, ny) ? 1 : 0);
    }, 0);

    return count;
  }

  forEachAliveCell(cb: (x: number, y: number) => void): void {
    for (const chunk of this.chunks.values()) {
      const aliveCells = chunk.getAliveCells();

      for (const cell of aliveCells) {
        const { x, y } = cell.real;
        cb(x, y);
      }
    }
  }

  getWorldType(): WorldType {
    return WorldType.Infinite;
  }

  isAlive(x: number, y: number): boolean {
    const coords = this.getCellCoords(x, y);

    const chunk = this.chunks.get(coords.chunk.key);
    return chunk?.isAlive(coords.local.x, coords.local.y) || false;
  }

  killCell(x: number, y: number): void {
    const coords = this.getCellCoords(x, y);

    const chunk = this.getChunk(x, y);
    if (!chunk) {
      return;
    }

    chunk.setCell(coords.local.x, coords.local.y, false);

    if (chunk.isEmpty()) {
      this.chunks.delete(coords.chunk.key);
    }
  }

  reviveCell(x: number, y: number): void {
    const coords = this.getCellCoords(x, y);

    const chunk = this.getOrCreateChunk(coords.chunk.x, coords.chunk.y);
    
    chunk.setCell(coords.local.x, coords.local.y, true);
  }

  forEachRelevantCell(
    cb: (x: number, y: number, alive: boolean, neighbors: number) => void
  ): void {
    const processed = new Set<string>();

    this.forEachAliveCell((ax, ay) => {
      const toVisit = NEIGHBORS.map(([dx, dy]) => [ax + dx, ay + dy]);
      toVisit.push([ax, ay]);

      for (const [vx, vy] of toVisit) {
        const key = `${vx},${vy}`;

        if (processed.has(key)) continue;
        processed.add(key);

        const c = this.getCellCoords(vx, vy);
        const chunk2 = this.chunks.get(c.chunk.key);
        const alive = chunk2 ? chunk2.isAlive(c.local.x, c.local.y) : false;
        const neighbors = this.countAliveNeighbors(vx, vy);

        cb(vx, vy, alive, neighbors);
      }
    });
  }
}

export class InfiniteWorldFactory implements WorldFactory<{}> {
  loadWorld(chunkData: Map<string, string>, _: {}): World {
    return new InfiniteWorld(chunkData);
  }

  createNew(_: {}): World {
    return new InfiniteWorld();
  }
}
