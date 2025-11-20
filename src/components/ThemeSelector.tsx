import { PreferencesState, usePreferencesStore } from "../store";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Computer, Moon, Sun } from "./svg";
import { ThemeValue } from "../util";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const getIndex = (theme: ThemeValue) => {
  switch (theme) {
    case ThemeValue.LIGHT:
      return 0;
    case ThemeValue.DARK:
      return 1;
    case ThemeValue.SYSTEM:
      return 2;
  }
};

export function ThemeSelector() {
  const { setTheme, preferences } = usePreferencesStore();
  const styles = getStyles(preferences);

  const position = useSharedValue(getIndex(preferences.configured));

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(-5 + position.value * 50, { duration: 300 }),
      },
    ],
  }));

  const handlePress = (theme: ThemeValue) => {
    setTheme(theme);
    position.value = getIndex(theme);
  };

  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.highlight, highlightStyle]} />
      <Pressable
        style={styles.themeContainer}
        onPress={() => handlePress(ThemeValue.LIGHT)}
      >
        <Sun fill={preferences.theme.text} />
      </Pressable>
      <Pressable
        style={styles.themeContainer}
        onPress={() => handlePress(ThemeValue.DARK)}
      >
        <Moon stroke={preferences.theme.text} />
      </Pressable>
      <Pressable
        style={styles.themeContainer}
        onPress={() => handlePress(ThemeValue.SYSTEM)}
      >
        <Computer fill={preferences.theme.text} />
      </Pressable>
    </View>
  );
}

const getStyles = (prefs: PreferencesState) =>
  StyleSheet.create({
    container: {
      backgroundColor: prefs.theme.surface0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 10,
      height: 60,
      padding: 10,
      borderRadius: 10,
    },
    themeContainer: {
      width: 40,
      height: 40,
    },
    highlight: {
      position: "absolute",
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: prefs.theme.mantle,
      left: 10,
    },
  });
