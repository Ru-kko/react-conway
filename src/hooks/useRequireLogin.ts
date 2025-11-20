import { useEffect } from "react";
import { useSessionStore } from "../store";
import { RootStackParamList } from "../navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

export function useRequireLogin() {
  const { user } = useSessionStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!user) {
      navigation.replace("SingIn");
    }
  }, [user]);

  return user as NonNullable<typeof user>;
}
