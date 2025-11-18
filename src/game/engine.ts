import { World, WorldType } from "./world";

export interface Engine {
  step(): void;
  getGeneration(): number;
  getWorldType(): WorldType;
  toggleCell(x: number, y: number): void;
  mapAliveCells<T>(cb: (x: number, y: number, key: string) => T): T[];
}

export class GameEngine implements Engine {
  private world: World;
  private generation: number = 0;

  constructor(world: World) {
    this.world = world;
  }

  getWorldType(): WorldType {
    return this.world.getWorldType();
  }

  toggleCell(x: number, y: number): void {
    const alive = this.world.isAlive(x, y);

    if (alive) {
      this.world.killCell(x, y);
      return;
    }

    this.world.reviveCell(x, y);
  }

  getGeneration(): number {
    return this.generation;
  }

  step(): void {
    const toRevive: Array<[number, number]> = [];
    const toKill: Array<[number, number]> = [];

    this.world.forEachRelevantCell((x, y, alive, neighbors) => {
      if (alive) {
        if (neighbors < 2 || neighbors > 3) {
          toKill.push([x, y]);
        }
        return;
      }
      if (neighbors === 3) {
        toRevive.push([x, y]);
      }
    });

    toKill.forEach(([x, y]) => this.world.killCell(x, y));
    toRevive.forEach(([x, y]) => this.world.reviveCell(x, y));
    this.generation++;
  }

  mapAliveCells<T>(cb: (x: number, y: number, key: string) => T): T[] {
    const results: T[] = [];

    this.world.forEachAliveCell((x, y) => {
      results.push(cb(x, y, `${x},${y}`));
    });

    return results;
  }
}
