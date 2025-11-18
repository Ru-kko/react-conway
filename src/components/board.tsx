import { View } from "react-native";
import { Engine } from "../game";
import { usePreferencesStore } from "../store";
import Animated from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { useBoardNavigation } from "../hooks";
import { useState } from "react";

const CELL_SIZE = 20;
interface BoardViewProps {
  engine: Engine;
  worldSize: number;
  toggleCell: (x: number, y: number) => void;
  renderVersion: number;
}

export function BoardView({ engine, worldSize, toggleCell }: BoardViewProps) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const { preferences } = usePreferencesStore();
  const { animatedStyle, gesture, values } = useBoardNavigation(CELL_SIZE, worldSize, viewport);

  const tapGesture = Gesture.Tap().onEnd((e) => {
    if (values.isPinch.value) {
      return;
    }
    const { x, y } = e;

    const worldX = (x - values.translationX.value) / values.scale.value;
    const worldY = (y - values.translationY.value) / values.scale.value;

    const cellX = Math.floor(worldX / CELL_SIZE);
    const cellY = Math.floor(worldY / CELL_SIZE);

    
    if (
      worldSize > 0 && 
      (cellX < 0 || cellX >= worldSize) || 
      (cellY < 0 || cellY >= worldSize)
    ) {
      return;
    }

    scheduleOnRN(toggleCell, cellX, cellY);
  });

  const composedGesture = Gesture.Simultaneous(gesture, tapGesture);

  return (
    <View style={{ flex: 1, borderColor: preferences.theme.surface0, borderWidth: 1 }}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setViewport({ width, height });
          }}
          style={{
            flex: 1,
            backgroundColor: preferences.theme.crust,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Animated.View style={[animatedStyle, { position: "absolute" }]}>
            {engine.mapAliveCells((x, y, key) => (
              <View
                key={key}
                style={{
                  position: "absolute",
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: preferences.theme.text,
                  left: x * CELL_SIZE,
                  top: y * CELL_SIZE,
                }}
              />
            ))}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
