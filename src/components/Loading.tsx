import { useEffect, useRef, useState } from "react";
import { WorldType } from "../constants";
import { GameEngine, WorldFactoryClient } from "../game";
import { usePreferencesStore } from "../store";
import { StyleProp, View, ViewStyle } from "react-native";

const FigureOpts = {
  data: 'FEF0RwQkQEJkhEZI',
  size: 9,
};

const TickSpeed = 300;

export function Loading({
  style,
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size: number;
}) {
  const { preferences } = usePreferencesStore();
  const [generation, setGeneration] = useState(0);
  const world = useRef(
    WorldFactoryClient.getFactory(WorldType.UltraSmall).createNew(FigureOpts)
  );
  const board = useRef(new GameEngine(world.current));

  useEffect(() => {
    const interval = setInterval(() => {
      board.current.step();
      setGeneration(board.current.getGeneration());
    }, TickSpeed);
    return () => clearInterval(interval);
  }, [generation]);

  return (
    <View style={[style, { width: size, height: size, position: "relative" }]}>
      {board.current.mapAliveCells((x, y, key) => (
        <View
          key={key}
          style={{
            width: size / FigureOpts.size,
            height: size / FigureOpts.size,
            backgroundColor: preferences.theme.text,
            position: "absolute",
            left: x * (size / FigureOpts.size),
            top: y * (size / FigureOpts.size),
          }}
        />
      ))}
    </View>
  );
}
