import { Text } from "@react-navigation/elements";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PreferencesState, usePreferencesStore } from "../../store";
import { CreateWorldView, FullOpacityModal, Gear, Loading } from "../../components";
import { useState } from "react";
import { useRequireLogin } from "../../hooks/useRequireLogin";

export function Home() {
  const { preferences } = usePreferencesStore();
  const user = useRequireLogin();
  const styles = getStyles(preferences);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [newWorldModalVisible, setNewWorldModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>Hi, {user?.username}!</Text>
        <TouchableOpacity>
          <Gear
            fill={preferences.theme.overlay2}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyText}>Your Saved Worlds</Text>
        <FlatList
          data={[]}
          renderItem={() => null}
          ListFooterComponent={loading ? <Loading size={50} /> : <></>}
        />
        <TouchableOpacity
          style={styles.addBox}
          onPress={() => setNewWorldModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {newWorldModalVisible && (
        <FullOpacityModal
          title="Create World"
          onDismiss={() => setNewWorldModalVisible(false)}
        >
          <CreateWorldView />
        </FullOpacityModal>
      )}
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
    head: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 10,
      width: "100%",
    },
    title: {
      color: prefs.theme.overlay2,
      fontFamily: prefs.font.regular,
      fontSize: 36,
    },
    body: {
      flex: 8,
      width: "100%",
      gap: 10,
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: prefs.theme.base,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingHorizontal: 10,
      paddingVertical: 50,
    },
    bodyText: {
      color: prefs.theme.subtext1,
      fontFamily: prefs.font.regular,
      fontSize: 32,
      alignSelf: "flex-start",
    },
    addBox: {
      width: 50,
      height: 50,
      borderRadius: 50,
      borderColor: prefs.theme.rosewater,
      borderWidth: 3,
      alignItems: "center",
      justifyContent: "center",
    },
    addButtonText: {
      color: prefs.theme.rosewater,
      fontFamily: prefs.font.bold,
      fontSize: 36,
    },
  });
