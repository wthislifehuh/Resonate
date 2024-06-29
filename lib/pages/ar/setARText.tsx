import {
    ViroARScene,
    ViroText,
    ViroTrackingReason,
    ViroTrackingStateConstants,
  } from "@reactvision/react-viro";
  import React, { useState, useEffect } from "react";
  import styles from "../../styles/ar_styles";
  
  type HelloWorldSceneARProps = {
    arText: string;
  };
  
  const HelloWorldSceneAR: React.FC<HelloWorldSceneARProps> = ({ arText }) => {
    const [text, setText] = useState("Initializing Emotion AR...");
    const [isTrackingNormal, setIsTrackingNormal] = useState(false);
  
    useEffect(() => {
      console.log("arText received in HelloWorldSceneAR:", arText); // Debug log
      if (isTrackingNormal) {
        console.log("Tracking is normal, setting text to arText:", arText);
        setText(arText); // Update the text state with arText if tracking is normal
      }
    }, [arText, isTrackingNormal]);
  
    function onInitialized(state: any, reason: ViroTrackingReason) {
      console.log("onInitialized", state, reason);
      if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
        setIsTrackingNormal(true);
        console.log("Tracking normal, setting text to arText:", arText);
        setText(arText); // Ensure arText is set when tracking is normal
      } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
        console.log("Tracking unavailable");
        setIsTrackingNormal(false);
        setText("Tracking unavailable");
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
  
  export default HelloWorldSceneAR;
  