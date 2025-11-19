
import { StyleProp, ViewStyle } from "react-native";
import { MicroConway } from "./MicroConway";

const FigureOpts = {
  data: 'FEF0RwQkQEJkhEZI',
  size: 9,
};

export function Loading({
  style,
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size: number;
}) {
  return (
    <MicroConway
      tickRate={300}
      style={style}
      size={size}
      worldSize={FigureOpts.size}
      hash={FigureOpts.data}
    />
  );
}
