import { StyleSheet, Text, View, Keyboard, Button } from "react-native";
import { PreferencesState, usePreferencesStore } from "../../store";
import { Key, Mail, MicroConway } from "../../components";
import { TextFormInpiut } from "../../components/Inputs";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

const animation = "AgUSFSAhIyQmJzI1QkVQUVNUVldiZXJ1";

export function SingIn() {
  const { preferences } = usePreferencesStore();
  const styles = getStyles(preferences);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.head, keyboardHeight > 0 && { flex: 0, height: 0 }]}>
        <Text
          style={{
            color: preferences.theme.text,
            fontFamily: preferences.font.bold,
            fontSize: 64,
          }}
        >
          Hello!
        </Text>
        <Text
          style={{
            color: preferences.theme.subtext1,
            fontFamily: preferences.font.bold,
            fontSize: 20,
          }}
        >
          Sign In!
        </Text>
        <MicroConway
          hash={animation}
          size={80}
          worldSize={8}
          tickRate={150}
          cellColor={preferences.theme.text}
          style={{ position: "absolute", top: 20, right: 20 }}
        />
      </View>

      <View style={[styles.body, { marginBottom: keyboardHeight }]}>
        <TextFormInpiut
          style={{ width: "100%" }}
          title="Email"
          placeholder="hello@world.com"
          onChange={() => {}}
          svg={<Mail stroke={preferences.theme.peach} />}
        />
        <TextFormInpiut
          style={{ width: "100%" }}
          title="Password"
          placeholder="••••••"
          password
          onChange={() => {}}
          svg={<Key stroke={preferences.theme.peach} />}
        />

        <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
          <LinearGradient
            colors={[preferences.theme.blue, preferences.theme.lavender]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.button}
          >
            <Text onPress={() => {}} style={styles.buttonText}>
              Sign In
            </Text>
          </LinearGradient>
          <Text style={{ color: preferences.theme.overlay1, fontFamily: preferences.font.thin, fontSize: 16 }}>or</Text>
          <Text
            onPress={() => {}}
            style={{
              color: preferences.theme.peach,
              fontFamily: preferences.font.bold,
              fontSize: 18,
            }}
          >
            Create an account
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = ({ theme, font }: PreferencesState) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
    },
    head: {
      flex: 3,
      justifyContent: "center",
      alignItems: "flex-start",
      backgroundColor: "transparent",
      padding: 30,
    },
    body: {
      flex: 7,
      backgroundColor: theme.base,
      justifyContent: "flex-start",
      alignItems: "center",
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 30,
      gap: 30,
    },
    button: {
      marginHorizontal: 50,
      borderRadius: 100,
      minWidth: "70%",
    },
    buttonText: {
      marginVertical: 5,
      marginHorizontal: 50,
      color: theme.base,
      fontFamily: font.bold,
      fontSize: 36,
      textAlign: "center",
      width: "100%",
    },
  });
