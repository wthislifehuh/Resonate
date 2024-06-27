// types.tsx
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  ARScene: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export type ARSceneScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ARScene'>;
