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
  Viro3DObject,
  ViroMaterials,
} from "@viro-community/react-viro";
import RNFS from 'react-native-fs';
import styles from "../../styles/ar_styles";
import useClientAudio from "../../../src/api/client-audio"; 
import backButtonIcon from '../../assets/icon/back-icon.png';
import { useScreenshot } from '../../../src/api/ScreenshotContext'; 

type RootStackParamList = {
  ARScene: undefined;
  Home: undefined;
};

const ARScene: React.FC<{ sceneNavigator: any, navigation: any }> = (props) => {
  const { setBase64Image } = useScreenshot(); // Use the custom hook to access the context
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus | null>(null);
  let { emotion, transcription } = props.sceneNavigator.viroAppProps;
  const [screenshotStatus, setScreenshotStatus] = useState<string | null>(null);
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
  });

  useEffect(() => {
    requestCameraPermission();
    const interval = setInterval(() => {
      takeScreenshot();
    }, 10000);

    return () => clearInterval(interval); // Clear the interval on component unmount
  }, []);

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

  const takeScreenshot = () => {
    props.sceneNavigator.takeScreenshot("AR_Screenshot", true).then(async (result: any) => {
      if (result.success) {
        setScreenshotStatus("Screenshot taken successfully!");
        if (result.url) {
          console.log(`Screenshot saved at: ${result.url}`);
          try {
            // Read the file and convert to base64
            const base64Data = await RNFS.readFile(result.url, 'base64');
            setBase64Image(`${base64Data}`);
            // console.log(`Base64 string: data:image/jpeg;base64,${base64Data.substr(0, 5)}`);
          } catch (error) {
            console.error("Error converting file to base64: ", error);
          }
        } else {
          console.error("No URL returned from takeScreenshot.");
        }
      } else {
        setScreenshotStatus("Failed to take screenshot.");
      }
      setTimeout(() => setScreenshotStatus(null), 3000); // Clear message after 3 seconds
    }).catch((error: any) => {
      console.error("Error taking screenshot: ", error);
      setScreenshotStatus("Failed to take screenshot.");
      setTimeout(() => setScreenshotStatus(null), 3000);
    });
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
      {emotion === "joy"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, 0, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={[emotion]}
          type="OBJ"
        />
        : emotion === "sad"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, 0, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["sad"]}
          type="OBJ"
        />
        : emotion === "angry"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, 0, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["angry"]}
          type="OBJ"
        />
        : emotion === "surprised"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, 0, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["surprised"]}
          type="OBJ"
        />
        : emotion === "fear"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, 0, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["fear"]}
          type="OBJ"
        />
        :
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, 0, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["neutral"]}
          type="OBJ"
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
