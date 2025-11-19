import { StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export const Key = ({
  stroke = "#000",
  style,
}: {
  stroke: string;
  style?: StyleProp<ViewStyle>;
}) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      stroke={stroke}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 9h.01M15 15a6 6 0 1 0-5.946-5.193c.058.434.087.651.068.789a.853.853 0 0 1-.117.346c-.068.121-.187.24-.426.479l-5.11 5.11c-.173.173-.26.26-.322.36a1 1 0 0 0-.12.29C3 17.296 3 17.418 3 17.663V19.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C3.76 21 4.04 21 4.6 21h1.737c.245 0 .367 0 .482-.028a.998.998 0 0 0 .29-.12c.1-.061.187-.148.36-.32l5.11-5.111c.239-.239.358-.358.48-.426a.852.852 0 0 1 .345-.117c.138-.02.355.01.789.068.264.036.533.054.807.054Z"
    />
  </Svg>
);

export const Mail = ({
  stroke = "#000",
  style,
}: {
  stroke?: string;
  style?: StyleProp<ViewStyle>;
}) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" style={style}>
    <Path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 8l-3.56 1.978c-1.986 1.103-2.979 1.655-4.03 1.87a6.6 6.6 0 0 1-2.82 0c-1.051-.215-2.044-.767-4.03-1.87L3 8m3.2 11h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 17.48 21 16.92 21 15.8V8.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 5 18.92 5 17.8 5H6.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C3 6.52 3 7.08 3 8.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 19 5.08 19 6.2 19Z"
    />
  </Svg>
);
