import { View } from "react-native";
import { Engine } from "../game";
import { usePreferencesStore } from "../store";
import Animated, {
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { useBoardNavigation } from "../hooks";
import { useEffect, useState } from "react";

const CELL_SIZE = 20;
const GRID_LINES_LIMIT = 200;

interface BoardViewProps {
  engine: Engine;
  worldSize: number;
  toggleCell: (x: number, y: number) => void;
  renderVersion: number;
}

export const GridLines = ({
  startX,
  endX,
  startY,
  endY,
  cellSize,
  limit,
  h,
  w,
}: {
  startX: number;
  endX: number;
  startY: number;
  endY: number;
  cellSize: number;
  limit: number;
  h: number;
  w: number;
}) => {
  const { preferences } = usePreferencesStore();
  const lines = [];

  for (let x = startX; x <= endX && (x <= limit || limit === 0); x++) {
    lines.push(
      <View
        key={`v-${x}`}
        style={{
          position: "absolute",
          left: x * cellSize,
          top: startY * cellSize,
          width: 1,
          height: limit > 0 ? Math.min(limit * cellSize, h * cellSize) : h * cellSize,
          backgroundColor: preferences.theme.surface0,
        }}
      />
    );
  }

  for (let y = startY; y <= endY && (y <= limit || limit === 0); y++) {
    lines.push(
      <View
        key={`h-${y}`}
        style={{
          position: "absolute",
          left: startX * cellSize,
          top: y * cellSize,
          height: 1,
          width: limit > 0 ? Math.min(limit * cellSize, w * cellSize ) : w * cellSize,
          backgroundColor: preferences.theme.surface0,
        }}
      />
    );
  }

  return <>{lines}</>;
};

export function BoardView({ engine, worldSize, toggleCell }: BoardViewProps) {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const viewportSV = useSharedValue({ width: 0, height: 0 });
  const [gridProps, setGridProps] = useState({
    startX: 0,
    endX: 0,
    startY: 0,
    endY: 0,
    totalLines: 0,
  });
  const { preferences } = usePreferencesStore();
  const { animatedStyle, gesture, values } = useBoardNavigation(
    CELL_SIZE,
    worldSize,
    viewport
  );

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
      (cellX < 0 || cellX >= worldSize ||
      cellY < 0 || cellY >= worldSize)
    ) {
      return;
    }

    scheduleOnRN(toggleCell, cellX, cellY);
  });

  const getVisibleGrid = () => {
    "worklet";
    const { width, height } = viewportSV.value;
    const scaledCell = CELL_SIZE * values.scale.get();

    const startX = Math.floor(-values.translationX.get() / scaledCell);
    const startY = Math.floor(-values.translationY.get() / scaledCell);

    const spaceX = width / scaledCell;
    const spaceY = height / scaledCell;

    const endX = Math.ceil(spaceX + startX);
    const endY = Math.ceil(spaceY + startY);

    return {
      totalLines: endX - startX + 1 + (endY - startY + 1),
      startX,
      startY,
      endX,
      endY,
    };
  };

  useEffect(() => {
    viewportSV.value = { width: viewport.width, height: viewport.height };
  }, [viewport]);

  useAnimatedReaction(
    () => ({ ...getVisibleGrid(), scale: values.scale.get() }),
    (value) => {
      scheduleOnRN(setGridProps, value);
    }
  );

  const composedGesture = Gesture.Simultaneous(gesture, tapGesture);

  return (
    <View
      style={{
        flex: 1,
        borderColor: preferences.theme.surface0,
        borderWidth: 1,
      }}
    >
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
            {GRID_LINES_LIMIT >= gridProps.totalLines && (
              <GridLines
                startX={gridProps.startX}
                endX={gridProps.endX}
                startY={gridProps.startY}
                endY={gridProps.endY}
                h={viewport.height}
                w={viewport.width}
                limit={worldSize}
                cellSize={CELL_SIZE}
              />
            )}
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
