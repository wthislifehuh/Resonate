import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, PermissionsAndroid, Platform, Alert, Text } from "react-native";
import { useNavigation } from '@react-navigation/native';
import ARConverse from "./arConverse";
import { check, request, PermissionStatus } from 'react-native-permissions';
import Voice from '@react-native-voice/voice';
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
import { useScreenshot } from '../../../src/context/ScreenshotContext'; 

type RootStackParamList = {
  ARScene: undefined;
  Home: undefined;
};

const ARScene: React.FC<{ sceneNavigator: any, navigation: any }> = (props) => {
  const { setBase64Image } = useScreenshot(); // Use the custom hook to access the context
  const [cameraPermission, setCameraPermission] = useState<PermissionStatus | null>(null);
  let { emotion, transcription } = props.sceneNavigator.viroAppProps;
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("Initializing AR...");

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    requestCameraPermission();

    const interval = setInterval(() => {
      takeScreenshot();
    }, 10000);

    // Start recording when the component mounts
    startRecording();

    // Stop recording and clean up when the component unmounts
    return () => {
      stopRecording();
      Voice.destroy().then(Voice.removeAllListeners);
      clearInterval(interval); // Clear the interval on component unmount
    };
  }, []);

  const onSpeechStart = () => setIsRecording(true);
  const onSpeechEnd = () => {
    setIsRecording(false);
    // Restart recording to continuously recognize speech
    startRecording();
  };
  const onSpeechError = (err: any) => {
    setError(err.error.message);
    // Restart recording on error
    startRecording();
  };
  const onSpeechResults = (result: any) => {
    if (result.value && result.value.length > 0) {
      setText(result.value[0]);
    }
  };

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
      setIsRecording(true);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

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
    // Debug
    // const timestamp = new Date().getTime();
    // const screenshotName = `AR_Screenshot_${timestamp}`;
    const screenshotName = `AR_Screenshot`;
    props.sceneNavigator.takeScreenshot(screenshotName, true).then(async (result: any) => {
      if (result.success) {
        if (result.url) {
          console.log(`Screenshot saved at: ${result.url}`);
          try {
            // Read the file and convert to base64
            const base64Data = await RNFS.readFile(result.url, 'base64');
            setBase64Image(base64Data);
            
            // Save the base64 string to a file
            // const path = RNFS.DocumentDirectoryPath + '/image.txt';
            // await RNFS.writeFile(path, base64Data, 'utf8');
            // console.log(`Base64 image saved to ${path}`);
          } catch (error) {
            console.error("Error converting file to base64: ", error);
          }
        } else {
          console.error("No URL returned from takeScreenshot.");
        }
      } else {
        console.log("Failed to take screenshot");
      }
    }).catch((error: any) => {
      console.error("Error taking screenshot: ", error);
    });
  };


  function onInitialized(state: any, reason: ViroTrackingReason) {
    console.log("onInitialized", state, reason);
    // No need to set text here, as it is being set by the voice recognition results
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.2, 0.2, 0.2]}  
        position={[0, -0.5, -1]}  
        width={5}  
        height={2}  
        style={styles.helloWorldTextStyle}
        maxLines={7}  
      />
      <ViroText
        text={emotion}
        scale={[0.2, 0.2, 0.2]}  
        position={[0, -0.4, -1]}  
        width={5}  
        height={2}  
        style={styles.helloWorldTextStyle}
        maxLines={7}  
      />
      {emotion === "joy"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, -1, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={[emotion]}
          type="OBJ"
        />
        : emotion === "sad"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, -1, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["sad"]}
          type="OBJ"
        />
        : emotion === "angry"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, -1, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["angry"]}
          type="OBJ"
        />
        : emotion === "surprised"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, -1, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["surprised"]}
          type="OBJ"
        />
        : emotion === "fear"?
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, -1, -5]}
          scale={[0.005, 0.005, 0.005]}
          rotation={[0, 0, 0]}
          materials={["fear"]}
          type="OBJ"
        />
        :
        <Viro3DObject
          source={require('../../assets/object/joy.obj')}
          position={[0, -1, -5]}
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
