import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import {
  PreferencesState,
  usePreferencesStore,
  useSessionStore,
} from "../../store";
import { Key, Mail, MicroConway } from "../../components";
import { TextFormInpiut } from "../../components/Inputs";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "..";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePopupStore } from "../../store/poppupStorePortal";

const animation = "AgUSFSAhIyQmJzI1QkVQUVNUVldiZXJ1";

export function SingIn() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signIn, canUseBiometrics, validateBiometricSession } =
    useSessionStore();
  const { preferences } = usePreferencesStore();
  const { showMessage } = usePopupStore();
  const styles = getStyles(preferences);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    loading: false,
  });

  const hadleLogin = async () => {
    try {
      if (userData.loading || !userData.email || !userData.password) return;
      setUserData((d) => ({ ...d, loading: true }));
      await signIn(userData.email, userData.password);
      navigation.replace("Home");
    } catch (error: any) {
      showMessage(error.message || "An error occurred during sign in.");
    }
    setUserData((d) => ({ ...d, loading: false }));
  };

  useEffect(() => {
    if (user) {
      navigation.replace("Home");
    }
  }, [user]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardHeight(0);
    });

    if (user) {
      navigation.replace("Home");
    }

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: preferences.theme.crust }}>
      <View style={styles.container}>
        <View
          style={[styles.head, keyboardHeight > 0 && { flex: 0, height: 0 }]}
        >
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
            onChange={(text) => {
              setUserData((d) => ({ ...d, email: text }));
            }}
            svg={<Mail stroke={preferences.theme.peach} />}
          />
          <TextFormInpiut
            style={{ width: "100%" }}
            title="Password"
            placeholder="••••••"
            password
            onChange={(text) => {
              setUserData((d) => ({ ...d, password: text }));
            }}
            svg={<Key stroke={preferences.theme.peach} />}
          />

          <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={[preferences.theme.yellow, preferences.theme.peach]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ width: "100%", borderRadius: 100 }}
              >
                <Text onPress={hadleLogin} style={styles.buttonText}>
                  Sign In
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {canUseBiometrics && (
              <TouchableOpacity
                onPress={() => {
                  validateBiometricSession();
                }}
              >
                <Text
                  style={{
                    color: preferences.theme.peach,
                    fontFamily: preferences.font.bold,
                    fontSize: 18,
                  }}
                >
                  Use Biometrics
                </Text>
              </TouchableOpacity>
            )}
            <Text
              style={{
                color: preferences.theme.overlay1,
                fontFamily: preferences.font.thin,
                fontSize: 16,
              }}
            >
              or
            </Text>
            <Text
              onPress={() => {
                navigation.navigate("SingUp");
              }}
              style={{
                color: preferences.theme.blue,
                fontFamily: preferences.font.bold,
                fontSize: 18,
              }}
            >
              Create an account
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = ({ theme, font }: PreferencesState) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: theme.crust,
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
