import { create } from "zustand";
import { ColorScheme, DarkTheme } from "../constants";
import * as Font from "expo-font";
import {
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { getConfiguredTheme, setConfiguredTheme, ThemeValue } from "../util";

export type PreferencesState = {
  isAppLoaded: boolean;
  theme: ColorScheme;
  font: {
    thin: string;
    regular: string;
    medium: string;
    bold: string;
    extraBold: string;
  };
};

interface PreferencesStore {
  preferences: PreferencesState;
  loadPreferences: () => Promise<void>;
  setTheme: (themeValue: ThemeValue) => Promise<void>;
}

export const usePreferencesStore = create<PreferencesStore>((set, get) => ({
  preferences: { isAppLoaded: false, theme: DarkTheme, font: { thin: "", regular: "", medium: "", bold: "", extraBold: "" }   },
  loadPreferences: async () => {
    const theme = await getConfiguredTheme();
    let fontsLoaded = true;
    let fonts = {
      thin: "Roboto_100Thin",
      regular: "Roboto_400Regular",
      medium: "Roboto_500Medium",
      bold: "Roboto_700Bold",
      extraBold: "Roboto_800ExtraBold",
    };

    await Font.loadAsync({
      Roboto_100Thin,
      Roboto_400Regular,
      Roboto_500Medium,
      Roboto_700Bold,
    }).catch(() => {
      fontsLoaded = false;
    });

    if (!fontsLoaded) {
      fonts = {
        thin: "",
        regular: "",
        medium: "",
        bold: "",
        extraBold: "",
      };
    }

    set({
      preferences: {
        isAppLoaded: true,
        theme,
        font: fonts,
      },
    });
  },
  setTheme: async (themeValue: ThemeValue) => {
    if (!get().preferences.isAppLoaded) return;
    const theme = await setConfiguredTheme(themeValue);

    set((state) => ({
      preferences: {
        ...state.preferences,
        theme: theme,
      },
    }));
  },
}));
