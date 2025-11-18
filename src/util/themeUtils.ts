import { Appearance } from "react-native";
import { ColorScheme, DarkTheme, LightTheme } from "../constants";
import * as SecureStore from "expo-secure-store";

const THEME_KEY = "theme";

export const enum ThemeValue {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export async function getConfiguredTheme(): Promise<ColorScheme> {
  let themeValue = await SecureStore.getItemAsync(THEME_KEY);

  if (themeValue === ThemeValue.DARK) {
    return DarkTheme;
  }

  if (themeValue === ThemeValue.LIGHT) {
    return LightTheme;
  }

  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "light" ? LightTheme : DarkTheme;
}

export async function setConfiguredTheme(themeValue: ThemeValue): Promise<ColorScheme> {
  await SecureStore.setItemAsync(THEME_KEY, themeValue);

  if (themeValue === ThemeValue.DARK) {
    return DarkTheme;
  }
  
  if (themeValue === ThemeValue.LIGHT) {
    return LightTheme;
  }

  return getSystemTheme();
}

function getSystemTheme(): ColorScheme {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === "light" ? LightTheme : DarkTheme;
}
