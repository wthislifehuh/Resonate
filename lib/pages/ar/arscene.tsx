import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, PermissionsAndroid, Platform, Text, Alert } from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { check, request, PERMISSIONS, RESULTS, PermissionStatus } from 'react-native-permissions';
import styles from "../../styles/ar_styles";
import ARConverse from "./arConverse";
import backButtonIcon from '../../assets/icon/back-icon.png';
import useClientAudio from "../../../src/api/client-audio"; 

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
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus | null>(null);
  const artext = useClientAudio();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera to display AR content.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        setCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED ? "granted" : "denied");
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Camera Permission Denied",
            "Camera access is required to use AR features. Please enable camera access in your device settings.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        }
      } else {
        setCameraPermission("granted");
      }
    }
  };

  if (cameraPermission !== "granted") {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to use AR features. Please enable camera access in your device settings.
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Image source={backButtonIcon} style={styles.backButtonIcon} />
        </TouchableOpacity>
      </View>
    );
  }

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
      <Text style={styles.alertText}>{artext}</Text>
    </View>
  );
};

export default ARScene;
