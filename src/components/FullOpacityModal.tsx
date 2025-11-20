import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from "react-native-reanimated";
import { PreferencesState, usePreferencesStore } from "../store";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Opacities } from "../constants";

interface FullOpacityModalProps {
  onDismiss: () => void;
  title: string;
  children?: React.ReactNode;
}

export function FullOpacityModal({
  onDismiss,
  title,
  children,
}: FullOpacityModalProps) {
  const { preferences } = usePreferencesStore();
  const styles = getStyles(preferences);

  const [fadeIn, fadeOut] = [FadeIn.duration(200), FadeOut.duration(300)];
  const [join, left] = [FadeInDown.duration(300), FadeOutDown.duration(200)];

  return (
    <Animated.View style={styles.container} entering={fadeIn} exiting={fadeOut}>
      <View onTouchEnd={onDismiss} style={{ flex: 4, width: "100%" }} />
      <Animated.View entering={join} exiting={left} style={styles.modalContent}>
        <KeyboardAvoidingView style={styles.keyboardAvoid} behavior="position">
          <Text style={styles.titleText}>{title}</Text>
          <ScrollView style={styles.scroll}>{children}</ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
}

const getStyles = (prefs: PreferencesState) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      height: "100%",
      backgroundColor: `${prefs.theme.crust}${Opacities.semiOpaque.hex}`,
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    keyboardAvoid: {
      width: "100%",
      height: "auto",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    modalContent: {
      width: "100%",
      flex: 6,
      backgroundColor: prefs.theme.base,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 20,
    },
    titleText: {
      borderColor: prefs.theme.overlay0,
      borderBottomWidth: 3,
      color: prefs.theme.text,
      fontFamily: prefs.font.bold,
      fontSize: 36,
      textAlign: "center",
    },
    scroll: {
      width: "100%",
      height: "100%",
      marginTop: 10,
    }
  });
