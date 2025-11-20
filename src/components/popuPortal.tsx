import { Pressable, Text, StyleSheet } from "react-native";
import { usePopupStore } from "../store/poppupStorePortal";
import { PreferencesState, usePreferencesStore } from "../store";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useEffect } from "react";

export function PopupPortal() {
  const { message, dismiss, messageDuration } = usePopupStore();
  const { preferences } = usePreferencesStore();
  const styles = getStyles(preferences);

  const fadeDuration = messageDuration * 0.1;

  const fadeIn = FadeIn.duration(fadeDuration);
  const fadeOut = FadeOut.duration(fadeDuration);

  useEffect(() => {
    if (!message) return;

    const timeout = setTimeout(() => {
      dismiss();
    }, messageDuration);
    
    return () => clearTimeout(timeout);
  }, [message]);

  if (!message) return null;

  return (
    <Animated.View entering={fadeIn} exiting={fadeOut}>
      <Pressable onPress={dismiss} style={styles.container}>
        <Text style={styles.messageText}>{message}</Text>
      </Pressable>
    </Animated.View>
  );
}

const getStyles = (pref: PreferencesState) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      bottom: 50,
      left: 20,
      right: 20,
      backgroundColor: pref.theme.overlay0,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    messageText: {
      color: pref.theme.base,
      fontFamily: pref.font.regular,
      fontSize: 16,
    },
  });
