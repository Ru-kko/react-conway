import { usePreferencesStore, useSessionStore } from "./store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { Navigation } from "./navigation";
import { PopupPortal } from "./components/popuPortal";

export function App() {
  const { loadPreferences } = usePreferencesStore();
  const { load } = useSessionStore();

  useEffect(() => {
    loadPreferences();
    load();
  }, []);

  return (
    <SafeAreaProvider>
      <Navigation />
      <PopupPortal />
    </SafeAreaProvider>
  );
}
