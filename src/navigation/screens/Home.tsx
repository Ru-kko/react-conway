import { Text } from "@react-navigation/elements";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  PreferencesState,
  usePreferencesStore,
  useSessionStore,
} from "../../store";
import {
  CreateWorldView,
  FullOpacityModal,
  Gear,
  Loading,
  LogOut,
} from "../../components";
import { useState } from "react";
import { useRequireLogin } from "../../hooks/useRequireLogin";
import { ThemeSelector } from "../../components/ThemeSelector";

export function Home() {
  const { preferences } = usePreferencesStore();
  const { signOutUser } = useSessionStore();
  const user = useRequireLogin();
  const styles = getStyles(preferences);
  const [loading, setLoading] = useState(false); // Todo: replace with actual loading state
  const [data, setData] = useState([]); // Todo: replace with saved worlds
  const [newWorldModalVisible, setNewWorldModalVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.title}>Hi, {user?.username}!</Text>
        <TouchableOpacity onPress={() => setShowSettings(true)}>
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
          heightPercent={40}
          onDismiss={() => setNewWorldModalVisible(false)}
        >
          <CreateWorldView />
        </FullOpacityModal>
      )}
      {showSettings && (
        <FullOpacityModal
          title="Settings"
          heightPercent={30}
          onDismiss={() => setShowSettings(false)}
        >
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <ThemeSelector />
            <TouchableOpacity
              onPress={() => signOutUser()}
              style={{
                height: 60,
                width: 60,
                backgroundColor: preferences.theme.mantle,
                borderColor: preferences.theme.surface0,
                borderWidth: 1,
                padding: 5,
                marginVertical: 10,
                borderRadius: 10,
              }}
            >
              <LogOut stroke={preferences.theme.red} />
            </TouchableOpacity>
          </View>
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
