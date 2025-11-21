import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  PreferencesState,
  useBoardStore,
  usePreferencesStore,
} from "../../store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StaticScreenProps, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { BoardView, Gear, Next, PauseIcon, PlayIcon } from "../../components";
import { RootStackParamList } from "..";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type GameScreenNavigationProp = StaticScreenProps<{
  size: number;
}>;

export function Game({ route }: GameScreenNavigationProp) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { preferences } = usePreferencesStore();
  const [showSettings, setShowSettings] = useState(false);
  const {
    engine,
    generation,
    terminate,
    toggleAutoTick,
    toggleCell,
    stepGeneration,
    renderVersion,
    isAutoTicking,
  } = useBoardStore();
  const styles = getStyles(preferences);

  useEffect(() => {
    if (!engine) {
      navigation.goBack();
      return;
    }

    return () => {
      terminate();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>Generation: {generation}</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
          <Gear
            fill={preferences.theme.overlay2}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <View style={styles.boardWrapper}>
          <GestureHandlerRootView >
            {engine && (
              <BoardView
                renderVersion={renderVersion}
                worldSize={route.params.size}
                toggleCell={toggleCell}
                engine={engine}
              />
            )}
          </GestureHandlerRootView>
        </View>
        <View style={styles.stateContainer}>
          <TouchableOpacity
            onPress={toggleAutoTick}
            style={[
              styles.stateOptionBox,
              {
                backgroundColor: isAutoTicking
                  ? preferences.theme.red
                  : preferences.theme.green,
              },
            ]}
          >
            {isAutoTicking ? <PauseIcon /> : <PlayIcon />}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isAutoTicking}
            onPress={() => !isAutoTicking && stepGeneration()}
            style={[
              styles.stateOptionBox,
              {
                backgroundColor: isAutoTicking
                  ? preferences.theme.mantle
                  : preferences.theme.blue,
              },
            ]}
          >
            <Next
              stroke={
                !isAutoTicking
                  ? preferences.theme.surface0
                  : preferences.theme.overlay1
              }
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (prefs: PreferencesState) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: prefs.theme.crust,
    },
    title: {
      color: prefs.theme.overlay2,
      fontFamily: prefs.font.regular,
      fontSize: 36,
    },
    head: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      width: "100%",
    },
    body: {
      flex: 9,
      width: "100%",
      gap: 10,
      justifyContent: "center",
      alignItems: "stretch",
      backgroundColor: prefs.theme.base,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 10,
      paddingVertical: 50,
    },
    boardWrapper: {
      width: "100%",
      height: "100%",
      flex: 8,
      justifyContent: "center",
      alignItems: "stretch",
    },
    stateContainer: {
      flex: 2,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    stateOptionBox: {
      padding: 10,
      borderRadius: 10,
    },
  });
