import { CHUNK_SIZE } from "./conf";
import { OutOfBoundsError } from "./error";

const SerializeClass = CHUNK_SIZE <= 16 ? Uint8Array : Uint16Array;

const COORDS_BITS = Math.log2(CHUNK_SIZE);

type Coordinate = { x: number; y: number; real: { x: number; y: number } };

interface Chunk {
  isEmpty(): boolean;
  isAlive(x: number, y: number): boolean;
  getAliveCells(): Coordinate[];
  getCoordinates(): { x: number; y: number };
  setCell(x: number, y: number, value: boolean): void;
  /**
   * Serializes the chunk's alive cells into a string representation.
   * @returns A string base64 representation of the chunk's alive cells.
   */
  serialize(): string;
}

class GameChunk implements Chunk {
  private cells: Set<number>;

  constructor(private x: number, private y: number, serial?: string) {
    this.cells = new Set<number>();

    if (serial) {
      this.deserialize(serial);
    }
  }

  private packCoordinate(coord: { x: number; y: number }): number {
    return (coord.x << COORDS_BITS) | coord.y;
  }

  getCoordinates(): { x: number; y: number } {
    return { x: this.x, y: this.y };
  }

  unPackCoordinate(packed: number): Coordinate {
    const x = (packed >> COORDS_BITS) & ((1 << COORDS_BITS) - 1);
    const y = packed & ((1 << COORDS_BITS) - 1);

    return {
      x,
      y,
      real: {
        x: this.x * CHUNK_SIZE + x,
        y: this.y * CHUNK_SIZE + y,
      },
    };
  }

  isEmpty(): boolean {
    return this.cells.size === 0;
  }

  isAlive(x: number, y: number): boolean {
    const packed = this.packCoordinate({ x, y });
    return this.cells.has(packed);
  }

  getAliveCells(): Coordinate[] {
    const result: Coordinate[] = [];

    console.log(this.serialize());
    for (const packed of this.cells) {
      result.push(this.unPackCoordinate(packed));
    }
    return result;
  }

  setCell(x: number, y: number, value: boolean): void {
    if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_SIZE) {
      throw new OutOfBoundsError(x, y);
    }

    const packet = this.packCoordinate({ x, y });

    if (value) {
      this.cells.add(packet);
      return;
    }

    if (!this.cells.has(packet)) {
      return;
    }

    this.cells.delete(packet);
  }

  serialize(): string {
    if (this.cells.size === 0) return "";

    const buffer = new SerializeClass(this.cells.size);
    let i = 0;

    for (const cell of this.cells) {
      buffer[i++] = cell;
    }

    const bytes =
      SerializeClass === Uint16Array ? new Uint8Array(buffer.buffer) : buffer;

    return btoa(String.fromCharCode(...bytes));
  }

  private deserialize(serial: string): void {
    if (!serial) return;
    console.log(serial);
    
    const binary = atob(serial);

    if (SerializeClass === Uint8Array) {
      for (let i = 0; i < binary.length; i++) {
        this.cells.add(binary.charCodeAt(i));
      }
      return;
    }
    for (let i = 0; i < binary.length; i += 2) {
      const value = binary.charCodeAt(i) | (binary.charCodeAt(i + 1) << 8);
      this.cells.add(value);
    }
  }
}

export class ChunkFactory {
  static createEmptyChunk(x: number, y: number): Chunk {
    return new GameChunk(x, y);
  }
  static createChunkFromAliveCells(
    x: number,
    y: number,
    serial: string
  ): Chunk {
    return new GameChunk(x, y, serial);
  }
}

export { Chunk };
