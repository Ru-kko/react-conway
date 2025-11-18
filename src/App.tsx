import { useBoardStore, usePreferencesStore } from "./store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WorldFactoryClient } from "./game";
import { WorldType } from "./constants";
import { BoardView } from "./components/board";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function App() {
  const {
    createNewGame,
    engine,
    toggleCell,
    renderVersion,
    toggleAutoTick,
    stepGeneration,
    isAutoTicking,
    worldSize,
  } = useBoardStore();
  const { theme, font } = usePreferencesStore((s) => s.preferences);
  const styles = StyleSheet.create({
    header: {
      paddingTop: 12,
      paddingHorizontal: 16,
      alignItems: "center",
      fontFamily: font.bold,
    },
    worldTypeText: {
      fontSize: 28,
      fontWeight: "900",
      textAlign: "center",
      color: theme.text,
      fontFamily: font.thin,
    },
    generationText: {
      fontSize: 16,
      fontWeight: "400",
      marginTop: 6,
      color: theme.subtext0,
    },
    boardWrapper: { flex: 1, justifyContent: "center", alignItems: "stretch" },
    bottomBar: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: "transparent",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 8,
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      fontFamily: font.medium,
    },
    small: {
      width: 48,
      height: 48,
      borderRadius: 5,
    },
    medium: {
      width: 72,
      height: 72,
      borderRadius: 10,
    },
    buttonText: {
      color: theme.mantle,
      fontWeight: "700",
    },
    disabled: { backgroundColor: theme.overlay1, color: theme.text },
    start: { backgroundColor: theme.green },
    next: { backgroundColor: theme.teal },
    stop: { backgroundColor: theme.yellow },
    delete: { backgroundColor: theme.red },
    share: { backgroundColor: theme.rosewater },
  });

  useEffect(() => {
    const worldFactory = WorldFactoryClient.getFactory(WorldType.Plain);

    createNewGame(worldFactory.createNew({ size: 0xff }), 0xff);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.base }}>
        <View style={styles.header}>
          <Text style={styles.worldTypeText}>{`${WorldType.Plain}`}</Text>
          <Text
            style={styles.generationText}
          >{`Generation: ${renderVersion}`}</Text>
        </View>

        <GestureHandlerRootView style={styles.boardWrapper}>
          {engine && (
            <BoardView
              engine={engine}
              worldSize={worldSize}
              toggleCell={toggleCell}
              renderVersion={renderVersion}
            />
          )}
        </GestureHandlerRootView>

        <View style={styles.bottomBar}>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.medium, isAutoTicking ? styles.stop : styles.start]}
              onPress={() => {toggleAutoTick()}}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{isAutoTicking ? "Stop" : "Start"}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.medium, isAutoTicking ? styles.disabled : styles.next]}
              onPress={() => {!isAutoTicking && stepGeneration()}}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.button, styles.small, styles.share]}
              onPress={() => {toggleAutoTick()}}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.small, styles.delete]}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
