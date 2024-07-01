import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';

// Request for camera permission
const requestCameraPermission = async () => {
  console.log('Requesting camera permission...');
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Resonate Camera Permission',
        message: 'Resonate needs access to your camera so you can connect seamlessly with the world',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Camera permission granted');
      return true;
    } else {
      console.log('Camera permission denied');
      Alert.alert('Permission Denied', 'Camera access is required to proceed.');
      return false;
    }
  } catch (err) {
    console.warn(err);
    Alert.alert('Error', 'An error occurred while requesting camera permission.');
    return false;
  }
};

// Request for microphone permission
const requestMicrophonePermission = async () => {
  console.log('Requesting microphone permission...');
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      {
        title: 'Resonate Microphone Permission',
        message: 'Resonate needs access to your microphone so you can connect seamlessly with the world',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Microphone permission granted');
      return true;
    } else {
      console.log('Microphone permission denied');
      Alert.alert('Permission Denied', 'Microphone access is required to proceed.');
      return false;
    }
  } catch (err) {
    console.warn(err);
    Alert.alert('Error', 'An error occurred while requesting microphone permission.');
    return false;
  }
};

// Main processing
const AudioTextDisplay = () => {
  const audioSocketRef = useRef(null);
  const videoSocketRef = useRef(null);
  const reconnectInterval = 5000; // 5 seconds
  const isInitialized = useRef(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const connectSocket = (url, ref, message) => {
      if (ref.current && ref.current.readyState === WebSocket.OPEN) {
        return; // Avoid reconnecting if already connected
      }
      ref.current = new WebSocket(url);

      ref.current.onopen = () => {
        console.log(`${message} WebSocket connection opened`);
      };

      ref.current.onmessage = (e) => {
        console.log(`Receiving message from the ${message.toLowerCase()} server...`);
        const data = JSON.parse(e.data);
        console.log(data);
      };

      ref.current.onerror = (e) => {
        console.log(`An error occurred in the ${message.toLowerCase()} server: ${e.message}`);
      };

      ref.current.onclose = (e) => {
        console.log(`Shutting down the ${message.toLowerCase()} server...`);
        console.log(e.code, e.reason);
        setTimeout(() => connectSocket(url, ref, message), reconnectInterval);
      };
    };

    const initializeConnections = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      const microphoneGranted = await requestMicrophonePermission();
      const cameraGranted = await requestCameraPermission();

      if (microphoneGranted && cameraGranted) {
        connectSocket('ws://192.168.1.4:8001', audioSocketRef, 'Audio');
        connectSocket('ws://192.168.1.4:8002', videoSocketRef, 'Video');

        const options = {
          sampleRate: 16000,  // default 44100
          channels: 1,        // 1 or 2, default 1
          bitsPerSample: 16,  // 8 or 16, default 16
          wavFile: 'test.wav' // default null
        };

        try {
          AudioRecord.init(options);
        } catch (err) {
          console.error('AudioRecord init error:', err);
        }

        AudioRecord.on('data', data => {
          console.log('Audio data received');
          if (audioSocketRef.current && audioSocketRef.current.readyState === WebSocket.OPEN) {
            audioSocketRef.current.send(data);
          }
        });
      }
    };

    initializeConnections();

    return () => {
      isInitialized.current = false;
      if (audioSocketRef.current) {
        audioSocketRef.current.close();
      }
      if (videoSocketRef.current) {
        videoSocketRef.current.close();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      await AudioRecord.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await AudioRecord.stop();
      setIsRecording(false);
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>WebSocket Example</Text>
      <Button title="Request Camera Permission" onPress={requestCameraPermission} />
      <Button title="Request Microphone Permission" onPress={requestMicrophonePermission} />
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopRecording : startRecording}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
});

export default AudioTextDisplay;
