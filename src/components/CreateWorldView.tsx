import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { PreferencesState, useBoardStore, usePreferencesStore } from "../store";
import { BorderedGrid, BorderlessGrid, InfiniteVector } from "./svg";
import { useState } from "react";
import { WorldType } from "../constants";
import { CHUNK_SIZE } from "../game/conf";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation";
import { WorldFactoryClient } from "../game";

export function CreateWorldView() {
  const { preferences } = usePreferencesStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = getStyles(preferences);

  const [selected, setSelected] = useState<WorldType | null>(null);
  const [size, setSize] = useState<number>(CHUNK_SIZE);
  const { createNewGame } = useBoardStore();

  const onCreatePress = () => {
    if (selected !== null) {
      const worldFactory = WorldFactoryClient.getFactory(selected);
      const finalSize = selected === WorldType.Infinite ? 0 : size;
      const world = worldFactory.createNew({ size: finalSize });

      createNewGame(world, finalSize);
      navigation.navigate("Game", { size: finalSize });
    }
  }

  return (
    <View>
      <View style={styles.worldTypeContainer}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelected(WorldType.Plain)}
        >
          <View
            style={[
              styles.blockContainer,
              {
                backgroundColor:
                  selected === WorldType.Plain
                    ? preferences.theme.mantle
                    : preferences.theme.crust,
              },
            ]}
          >
            <BorderedGrid stroke={preferences.theme.overlay0} />
          </View>
          <Text style={styles.touchableText}>Plain</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelected(WorldType.Toroidal)}
        >
          <View
            style={[
              styles.blockContainer,
              {
                backgroundColor:
                  selected === WorldType.Toroidal
                    ? preferences.theme.mantle
                    : preferences.theme.crust,
              },
            ]}
          >
            <BorderlessGrid fill={preferences.theme.overlay0} />
          </View>
          <Text style={styles.touchableText}>BorderLess</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => setSelected(WorldType.Infinite)}
        >
          <View
            style={[
              styles.blockContainer,
              {
                backgroundColor:
                  selected === WorldType.Infinite
                    ? preferences.theme.mantle
                    : preferences.theme.crust,
              },
            ]}
          >
            <InfiniteVector fill={preferences.theme.overlay0} />
          </View>
          <Text style={styles.touchableText}>Infinite</Text>
        </TouchableOpacity>
      </View>
      {selected !== WorldType.Infinite && selected !== null && (
        <View style={styles.sizeContainer}>
          <TouchableOpacity
            onPress={() =>
              setSize((prev) => Math.max(CHUNK_SIZE, prev - CHUNK_SIZE))
            }
          >
            <Text style={styles.arrows}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.rollerText}>
            {size} x {size} chunks
          </Text>
          <TouchableOpacity
            onPress={() => setSize((prev) => prev + CHUNK_SIZE)}
          >
            <Text style={styles.arrows}>{">"}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          height: 40,
          width: "100%",
          marginTop: 20,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={onCreatePress}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: preferences.font.bold,
              backgroundColor: preferences.theme.green,
              color: preferences.theme.overlay0,
              paddingHorizontal: 30,
              paddingVertical: 10,
              borderRadius: 40,
              height: 45,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            Create
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (preferences: PreferencesState) =>
  StyleSheet.create({
    worldTypeContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      paddingTop: 20,
    },
    blockContainer: {
      width: 90,
      height: 90,
      borderRadius: 15,
      padding: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    touchable: {
      flexDirection: "column",
      gap: 2,
      alignItems: "center",
    },
    touchableText: {
      color: preferences.theme.text,
      fontFamily: preferences.font.thin,
      fontSize: 15,
    },
    sizeContainer: {
      marginTop: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: preferences.theme.surface0,
      backgroundColor: preferences.theme.crust,
      gap: 10,
      height: 30,
    },
    rollerText: {
      color: preferences.theme.text,
      fontFamily: preferences.font.medium,
      fontSize: 18,
      height: 30,
      textAlignVertical: "center",
      textAlign: "center",
    },
    arrows: {
      fontSize: 24,
      fontFamily: preferences.font.bold,
      paddingHorizontal: 5,
      backgroundColor: preferences.theme.surface0,
      width: 30,
      height: 30,
      textAlign: "center",
      textAlignVertical: "center",
      color: preferences.theme.text,
    },
  });
