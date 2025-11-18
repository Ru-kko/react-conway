import { CellCoordinate, NEIGHBORS } from ".";
import { Chunk , ChunkFactory } from "../chunk";
import { GameSizeError, OutOfBoundsError } from "../error";
import { World, WorldFactory, WorldType } from "../world";
import { CHUNK_SIZE } from "../conf";

class ToroidalWorld implements World {
  private chunks: Map<string, Chunk> = new Map();

  constructor(private size: number, chunkData?: Map<string, string>) {
    if (!chunkData) {
      return;
    }

    if ((this.size + 1) % CHUNK_SIZE !== 0) {
      throw new GameSizeError(this.size);
    }

    for (const [key, serial] of chunkData.entries()) {
      const [chunkX, chunkY] = key.split(",").map(Number);
      if (
        chunkX < 0 ||
        chunkX >= Math.ceil(this.size / 16) ||
        chunkY < 0 ||
        chunkY >= Math.ceil(this.size / 16)
      ) {
        throw new OutOfBoundsError(chunkX, chunkY);
      }

      this.chunks.set(
        key,
        ChunkFactory.createChunkFromAliveCells(chunkX, chunkY, serial)
      );
    }
  }

  private wrap(x: number, y: number): { x: number; y: number } {
    const wrappedX = ((x % this.size) + this.size) % this.size;
    const wrappedY = ((y % this.size) + this.size) % this.size;
    return { x: wrappedX, y: wrappedY };
  }


  private validateCoordinates(x: number, y: number): void {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) {
      throw new OutOfBoundsError(x, y);
    }
  }

  private getCellCoords(x: number, y: number): CellCoordinate {
    const wrapped = this.wrap(x, y);

    return {
      chunk: {
        x: Math.floor(wrapped.x / 16),
        y: Math.floor(wrapped.y / 16),
        key: `${Math.floor(wrapped.x / 16)},${Math.floor(wrapped.y / 16)}`,
      },
      local: {
        x: wrapped.x % 16,
        y: wrapped.y % 16,
      },
    };
  }

  forEachAliveCell(cb: (x: number, y: number) => void): void {
    for (const chunk of this.chunks.values()) {
      const aliveCells = chunk.getAliveCells();
      
      for (const cell of aliveCells) {
        const { x, y } = cell.real;
        const wrapped = this.wrap(x, y);
        cb(wrapped.x, wrapped.y);
      }
    }
  }

  getWorldType(): WorldType {
    return WorldType.Toroidal;
  }

  isAlive(x: number, y: number): boolean {
    this.validateCoordinates(x, y);
    const { chunk, local } = this.getCellCoords(x, y);
    const chunkInstance = this.chunks.get(chunk.key);

    return chunkInstance?.isAlive(local.x, local.y) || false;
  }

  killCell(x: number, y: number): void {
    this.validateCoordinates(x, y);
    const coords = this.getCellCoords(x, y);
    const chunk = this.chunks.get(coords.chunk.key);
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
    let chunk = this.chunks.get(coords.chunk.key);
    if (!chunk) {
      chunk = ChunkFactory.createEmptyChunk(coords.chunk.x, coords.chunk.y);
      this.chunks.set(coords.chunk.key, chunk);
    }

    chunk.setCell(coords.local.x, coords.local.y, true);
  }

  forEachRelevantCell(
    cb: (x: number, y: number, alive: boolean, neighbors: number) => void
  ): void {
    const processed = new Set<string>();

    const add = (x: number, y: number) => {
      const { x: wx, y: wy} = this.wrap(x, y);
      const key = `${wx},${wy}`;
      
      if (processed.has(key)) {
        return;
      }
      processed.add(key);

      let count = NEIGHBORS.reduce((acc, [nx, ny]) => {
        const { x: wxn, y: wyn } = this.wrap(wx + nx, wy + ny);
        return acc + (this.isAlive(wxn, wyn) ? 1 : 0);
      }, 0);

      const alive = this.isAlive(wx, wy);
      cb(wx, wy, alive, count);
    }

    this.forEachAliveCell((x, y) => {
      add(x, y);
      
      for (const [dx, dy] of NEIGHBORS) {
        add(x + dx, y + dy);
      }
    });
  }
}

export class ToroidalWorldFactory implements WorldFactory<{size: number}> {
  loadWorld(chunkData: Map<string, string>, options: { size: number; }): World {
    return new ToroidalWorld(options.size, chunkData);
  }

  createNew(options: { size: number; }): World {
    return new ToroidalWorld(options.size);
  }
}
