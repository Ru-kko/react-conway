import { create } from "zustand";
import { Engine, GameEngine, World } from "../game";

interface BoardStore {
  intervalId: number | null;
  generation: number;
  isAutoTicking: boolean;
  tickInterval: number;
  engine: Engine | null;
  renderVersion: number;
  /**
   * The size of the world (for finite worlds).
   * if the world is infinite, this will be 0.
   */
  worldSize: number; 

  createNewGame(world: World, size?: number): void;

  toggleCell(x: number, y: number): void;

  stepGeneration(): void;

  toggleAutoTick(): void;

  changeTickInterval(interval: number): void;

  terminate(): void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  intervalId: null,
  engine: null,
  isAutoTicking: false,
  generation: 0,
  tickInterval: 500,
  renderVersion: 0,
  worldSize: 0,

  createNewGame(world: World, size: number = 0) {
    const engine = new GameEngine(world);
    set({ engine, generation: 0, renderVersion: get().renderVersion + 1, worldSize: size });
  },

  toggleCell(x: number, y: number) {
    const engine = get().engine;
    if (!engine) return;

    
    engine.toggleCell(x, y);

    set({ renderVersion: get().renderVersion + 1 });
  },

  stepGeneration() {
    const engine = get().engine;
    console.log("Step");
    
    if (!engine) return;

    engine.step();
    set({
      generation: engine.getGeneration(),
      renderVersion: get().renderVersion + 1,
    });
  },

  toggleAutoTick() {
    if (!get().engine) return;

    const intervalId = get().intervalId;

    if (intervalId) {
      clearInterval(intervalId);
      set({ intervalId: null, isAutoTicking: false });
      return;
    }

    const newIntervalId = window.setInterval(() => {
      get().stepGeneration();
    }, get().tickInterval);

    set({ intervalId: newIntervalId, isAutoTicking: true });
  },

  changeTickInterval(interval: number) {
    if (!get().engine) return;

    const intervalId = get().intervalId;
    if (intervalId) {
      clearInterval(intervalId);
    }

    const newIntervalId = window.setInterval(() => {
      get().stepGeneration();
    }, interval);

    set({ tickInterval: interval, intervalId: newIntervalId, isAutoTicking: true });
  },

  terminate() {
    const intervalId = get().intervalId;
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    set({
      intervalId: null,
      generation: 0,
      engine: null,
      renderVersion: get().renderVersion + 1,
      isAutoTicking: false,
    });
  },
}));
