// arscene.tsx
import {
    ViroARScene,
    ViroARSceneNavigator,
    ViroText,
    ViroTrackingReason,
    ViroTrackingStateConstants,
  } from "@reactvision/react-viro";
  import React, { useState } from "react";
  import { StyleSheet } from "react-native";
  
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
  
  const ARScene = () => {
    return (
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.f1}
      />
    );
  };
  
  const styles = StyleSheet.create({
    f1: { flex: 1 },
    helloWorldTextStyle: {
      fontFamily: "Arial",
      fontSize: 30,
      color: "#ffffff",
      textAlignVertical: "center",
      textAlign: "center",
    },
  });
  
  export default ARScene;
  