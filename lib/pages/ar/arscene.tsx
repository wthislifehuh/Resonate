import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, PermissionsAndroid, Platform, Alert, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ARConverse from "./arConverse";
import { check, request, PermissionStatus } from 'react-native-permissions';
import {
  ViroARSceneNavigator,
  ViroARScene,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroAmbientLight,
  Viro3DObject,
  ViroMaterials,
} from "@reactvision/react-viro";
import styles from "../../styles/ar_styles";
import useClientAudio from "../../../src/api/client-audio"; 
import backButtonIcon from '../../assets/icon/back-icon.png';
import HomePage from "../home_page";

type RootStackParamList = {
  ARScene: undefined;
  Home: undefined;
};

const ARScene: React.FC<{ sceneNavigator: any, navigation: any }> = (props) => {
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus | null>(null);
  let { emotion, transcription } = props.sceneNavigator.viroAppProps;
  const [text, setText] = useState("Initializing AR...");

  ViroMaterials.createMaterials({
    joy:{
      diffuseTexture:require('../../assets/object/joy.png')
    },
    sad:{
      diffuseTexture:require('../../assets/object/sad.png')
    },
    angry:{
      diffuseTexture:require('../../assets/object/angry.png')
    },
    surprised:{
      diffuseTexture:require('../../assets/object/surprised.png')
    },
    fear:{
      diffuseTexture:require('../../assets/object/fear.png')
    },
    neutral:{
      diffuseTexture:require('../../assets/object/neutral.png')
    },
  })

  useEffect(() => {
    requestCameraPermission();
  });

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
            [{ text: "OK", onPress: () => props.navigation.goBack() }]
          );
        }
      } else {
        setCameraPermission("granted");
      }
    }
  };

  function onInitialized(state: any, reason: ViroTrackingReason) {
      console.log("onInitialized", state, reason);
      if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
        setText(`${transcription}`);
      } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
      }
  }

  return (
      <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
          text={text}
          scale={[0.3, 0.3, 0.3]}
          position={[0, -0.4, -1]}
          style={styles.helloWorldTextStyle}
      />
      {/* <ViroAmbientLight color="#ffffff"/> */}
      {emotion === "joy"?
        <Viro3DObject
          source = {require('../../assets/object/joy.obj')}
          position={[0,0,-5]}
          scale={[0.005, 0.005, 0.005]}
          rotation = {[0, 0, 0]}
          materials={["joy"]}
          type = "OBJ"
        />
        :emotion === "sad"?
        <Viro3DObject
          source = {require('../../assets/object/joy.obj')}
          position={[0,0,-5]}
          scale={[0.005, 0.005, 0.005]}
          rotation = {[0, 0, 0]}
          materials={["sad"]}
          type = "OBJ"
        />
        :emotion === "angry"?
        <Viro3DObject
        source = {require('../../assets/object/joy.obj')}
          position={[0,0,-5]}
          scale={[0.005, 0.005, 0.005]}
          rotation = {[0, 0, 0]}
          materials={["angry"]}
          type = "OBJ"
        />
        :emotion === "surprised"?
        <Viro3DObject
        source = {require('../../assets/object/joy.obj')}
          position={[0,0,-5]}
          scale={[0.005, 0.005, 0.005]}
          rotation = {[0, 0, 0]}
          materials={["surprised"]}
          type = "OBJ"
        />
        :emotion === "fear"?
        <Viro3DObject
        source = {require('../../assets/object/joy.obj')}
          position={[0,0,-5]}
          scale={[0.005, 0.005, 0.005]}
          rotation = {[0, 0, 0]}
          materials={["fear"]}
          type = "OBJ"
        />
        :
        <Viro3DObject
        source = {require('../../assets/object/joy.obj')}
          position={[0,0,-5]}
          scale={[0.005, 0.005, 0.005]}
          rotation = {[0, 0, 0]}
          materials={["neutral"]}
          type = "OBJ"
        />
      }
      </ViroARScene>
  );
};

export default () => {
  const { emotion, transcription } = useClientAudio();
  const navigation = useNavigation();
    
    return (
      <View style={{ flex: 1 }}>
        <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
            scene: ARScene,
        }}
        viroAppProps={{ emotion, transcription }}
        style={styles.f1}
        />
        <ARConverse />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Image source={backButtonIcon} style={styles.backButtonIcon} />
        </TouchableOpacity>
      </View>
    );
};
