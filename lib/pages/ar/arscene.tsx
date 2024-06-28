import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import styles from "../../styles/ar_styles";
import ARConverse from "./arConverse";
import backButtonIcon from '../../assets/icon/back-icon.png';

type RootStackParamList = {
  ARScene: undefined;
  Home: undefined;
};

type ARSceneNavigationProp = StackNavigationProp<RootStackParamList, 'ARScene'>;

type Props = {
  navigation: ARSceneNavigationProp;
};

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing Emotion AR...");

  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("I am very sad!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
    </ViroARScene>
  );
};

const ARScene: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.f1}
      />
      <ARConverse />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image source={backButtonIcon} style={styles.backButtonIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ARScene;
