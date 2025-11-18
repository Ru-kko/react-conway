import { WorldType } from "../constants";
import { InfiniteWorldFactory } from "./impl";
import { PlainWorldFactory } from "./impl/plain";
import { ToroidalWorldFactory } from "./impl/torioidal";

export type PersistentWorldData<T> = T & {
  worldType: WorldType;
  chunks: {
    [key: string]: string;
  };
};

export interface World {
  getWorldType(): WorldType;
  isAlive(x: number, y: number): boolean;
  killCell(x: number, y: number): void;
  reviveCell(x: number, y: number): void;
  forEachAliveCell(cb: (x: number, y: number) => void): void;
  /**
   * Iterates over each cell that is relevant for the next state calculation,
   * including alive cells and their neighbors.
   * @param cb Callback function to be called with the coordinates and alive status of each relevant cell.
   */
  forEachRelevantCell(
    cb: (x: number, y: number, alive: boolean, neighbors: number) => void
  ): void;
}

export interface WorldFactory<T> {
  loadWorld(chunkData: Map<string, string>, options: T): World;
  createNew(options: T): World;
}

export class WorldFactoryClient {
  static getFactory<T>(worldType: WorldType): WorldFactory<T> {
    switch (worldType) {
      case WorldType.Plain:
        return new PlainWorldFactory() as WorldFactory<T>;
      case WorldType.Toroidal:
        return new ToroidalWorldFactory() as WorldFactory<T>;
      case WorldType.Infinite:
      default:
        return new InfiniteWorldFactory() as WorldFactory<T>;
    }
  }
}