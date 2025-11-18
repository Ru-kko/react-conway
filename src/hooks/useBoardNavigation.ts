import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";

const DEFAULT_MIN_SCALE = 0.1;
const DEFAULT_MAX_SCALE = 3;

export function useBoardNavigation(
  cellSize: number,
  worldSize: number,
  viewport: { width: number; height: number }
) {
  const isPinch = useSharedValue(false);
  const scale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const startScale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const worldPx = worldSize > 0 ? worldSize * cellSize : Infinity;

  const clampTranslation = (tx: number, ty: number, scale: number) => {
    'worklet';
    if (!viewport || worldSize === 0) {
      return { x: tx, y: ty };
    }

    const scaledWorld = worldPx * scale;

    const minX = Math.min(0, viewport.width - scaledWorld);
    const maxX = 0;

    const minY = Math.min(0, viewport.height - scaledWorld);
    const maxY = 0;

    return {
      x: Math.max(minX, Math.min(maxX, tx)),
      y: Math.max(minY, Math.min(maxY, ty)),
    };
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }));

  const panGesture = Gesture.Pan().onUpdate((e) => {
    let newX = translationX.value + e.translationX * 0.1;
    let newY = translationY.value + e.translationY * 0.1;

    const clamped = clampTranslation(newX, newY, scale.value);
    translationX.value = clamped.x;
    translationY.value = clamped.y;
  });

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      isPinch.value = true;
      startScale.value = scale.value;
      startX.value = (e.focalX - translationX.value) / scale.value;
      startY.value = (e.focalY - translationY.value) / scale.value;
    })
    .onUpdate((e) => {
      let newScale = startScale.value * e.scale;
      newScale = Math.max(
        DEFAULT_MIN_SCALE,
        Math.min(DEFAULT_MAX_SCALE, newScale)
      );

      let newX = e.focalX - startX.value * newScale;
      let newY = e.focalY - startY.value * newScale;

      const clamped = clampTranslation(newX, newY, newScale);

      scale.value = newScale;
      translationX.value = clamped.x;
      translationY.value = clamped.y;
    })
    .onEnd(() => {
      startScale.value = scale.value;
      isPinch.value = false;
    });

  const composed = Gesture.Simultaneous(panGesture, pinchGesture);

  return {
    animatedStyle,
    gesture: composed,
    values: {
      scale,
      translationX,
      translationY,
      isPinch,
    },
  } as const;
}
