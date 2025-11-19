import {
  createStaticNavigation,
  StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from './screens/Home';
import { SingIn } from './screens/SingIn';
import { SingUp } from './screens/SingUp';

const RootStack = createNativeStackNavigator({
  screens: {
    SingIn: {
      screen: SingIn,
      options: {
        title: 'Sign In',
        headerShown: false,
      },
    },
    SingUp: {
      screen: SingUp,
      options: {
        title: 'Sign Up',
        headerShown: false,
      },
    },
    Home: {
      screen: Home,
      options: {
        title: 'Home',
        headerShown: false,
      },
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);

export type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
