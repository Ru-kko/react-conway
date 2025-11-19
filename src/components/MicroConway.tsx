import { useEffect, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { WorldType } from "../constants";
import { Engine, GameEngine, WorldFactoryClient } from "../game";
import { usePreferencesStore } from "../store";

interface MicroConwayProps {
  tickRate?: number;
  style?: StyleProp<ViewStyle>;
  cellColor?: string;
  size: number;
  worldSize: number;
  hash: string;
}

export function MicroConway({
  tickRate = 300,
  style,
  cellColor,
  size,
  worldSize,
  hash,
}: MicroConwayProps) {

  const { preferences } = usePreferencesStore();
  const [_, setGeneration] = useState(0);
  const [engine, setEngine] = useState<Engine | null>(null);

  useEffect(() => {
    const world = WorldFactoryClient.getFactory(WorldType.UltraSmall).createNew(
      { size: worldSize, data: hash }
    );

    const newEngine = new GameEngine(world);

    setEngine(newEngine);
  }, [hash]);

  useEffect(() => {
    if (!engine) return;

    const interval = setInterval(() => {
      engine.step();
      setGeneration(engine.getGeneration());
    }, tickRate);
    
    return () => clearInterval(interval);
  }, [engine, tickRate]);

  return (
    <View
      style={[
        style,
        {
          width: size,
          height: size,
          position: "relative",
        },
      ]}
    >
      {engine &&
        engine.mapAliveCells((x, y, key) => (
          <View
            key={key}
            style={{
              width: size / worldSize,
              height: size / worldSize,
              backgroundColor: cellColor || preferences.theme.text,
              position: "absolute",
              left: x * (size / worldSize),
              top: y * (size / worldSize),
            }}
          />
        ))}
    </View>
  );
}
