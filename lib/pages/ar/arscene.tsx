import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, PermissionsAndroid, Platform, Alert , Text} from "react-native";
import { StackNavigationProp } from '@react-navigation/stack';
import { check, request, PermissionStatus } from 'react-native-permissions';
import {
  ViroARSceneNavigator,
} from "@reactvision/react-viro";
import styles from "../../styles/ar_styles";
import ARConverse from "./arConverse";
import useClientAudio from "../../../src/api/client-audio"; 
import backButtonIcon from '../../assets/icon/back-icon.png';
import HelloWorldSceneAR from "./setARText";

type RootStackParamList = {
  ARScene: undefined;
  Home: undefined;
};

type ARSceneNavigationProp = StackNavigationProp<RootStackParamList, 'ARScene'>;

type Props = {
  navigation: ARSceneNavigationProp;
};

const ARScene: React.FC<Props> = ({ navigation }) => {
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus | null>(null);
  const { text: arText } = useClientAudio();

  useEffect(() => {
    console.log("arText in ARScene:", arText); // Debug log
    requestCameraPermission();
  }, [arText]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (!result) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "📷 Camera Permission",
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

  return (
    <View style={{ flex: 1 }}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: () => <HelloWorldSceneAR arText={arText} />,
        }}
        style={styles.f1}
      />
      <Text style={styles.alertText}>{arText} </Text>
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
