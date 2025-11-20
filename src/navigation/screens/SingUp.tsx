import {
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { Text as NavText } from "@react-navigation/elements";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "..";
import { usePopupStore } from "../../store/poppupStorePortal";

const animation = "AgUSFSAhIyQmJzI1QkVQUVNUVldiZXJ1";

export function SingUp() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { signUp, user } = useSessionStore();
  const { showMessage } = usePopupStore();
  const { preferences } = usePreferencesStore();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    userName: "",
    loading: false,
  });
  const styles = getStyles(preferences);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const hadleRegister = async () => {
    try {
      if (
        userData.loading ||
        !userData.email ||
        !userData.password ||
        !userData.userName
      )
        return;
      setUserData((d) => ({ ...d, loading: true }));
      await signUp(userData.email, userData.password, userData.userName);
      navigation.replace("Home");
    } catch (error: any) {
      showMessage(error.message);
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
          <Text style={styles.title}>Create Your</Text>
          <Text style={styles.title}>Account</Text>
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
            hintColor={preferences.theme.lavender}
            style={{ width: "100%" }}
            title="User Name"
            placeholder="Jonh Doe"
            onChange={(text) => {
              setUserData((d) => ({ ...d, userName: text }));
            }}
          />
          <TextFormInpiut
            hintColor={preferences.theme.lavender}
            style={{ width: "100%" }}
            title="Email"
            placeholder="hello@world.com"
            onChange={(text) => {
              setUserData((d) => ({ ...d, email: text }));
            }}
            svg={<Mail stroke={preferences.theme.lavender} />}
          />
          <TextFormInpiut
            style={{ width: "100%" }}
            title="Password"
            placeholder="••••••"
            hintColor={preferences.theme.lavender}
            password
            onChange={(text) => {
              setUserData((d) => ({ ...d, password: text }));
            }}
            svg={<Key stroke={preferences.theme.lavender} />}
          />

          <View style={{ width: "100%", alignItems: "center", gap: 20 }}>
            <TouchableOpacity style={styles.button} onPress={hadleRegister}>
              <LinearGradient
                style={{ borderRadius: 100, width: "100%" }}
                colors={[preferences.theme.blue, preferences.theme.lavender]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text
              style={{
                color: preferences.theme.overlay1,
                fontFamily: preferences.font.thin,
                fontSize: 16,
              }}
            >
              or
            </Text>
            <NavText
              onPress={() => {
                navigation.navigate("SingIn");
              }}
              style={{
                color: preferences.theme.peach,
                fontFamily: preferences.font.bold,
                fontSize: 18,
              }}
            >
              Sing In
            </NavText>
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
    title: {
      color: theme.text,
      fontFamily: font.bold,
      fontSize: 45,
    },
    head: {
      flex: 2,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      backgroundColor: "transparent",
      padding: 30,
    },
    body: {
      flex: 8,
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
