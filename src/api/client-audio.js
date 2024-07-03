import React, { useEffect, useRef, useState } from 'react';
import {
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import AudioRecord from 'react-native-audio-record';
import { Buffer } from 'buffer';

const requestPermission = async (permission, title, message) => {
  console.log(`Requesting ${permission} permission...`);
  try {
    const granted = await PermissionsAndroid.request(permission, {
      title,
      message,
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log(`${permission} permission granted`);
      return true;
    } else {
      console.log(`${permission} permission denied`);
      Alert.alert('Permission Denied', `${title} access is required to proceed.`);
      return false;
    }
  } catch (err) {
    console.warn(err);
    Alert.alert('Error', `An error occurred while requesting ${title} permission.`);
    return false;
  }
};

const extractAndSortEmotions = (result) => {
  try {
    const messageContent = JSON.parse(result.choices[0].message.content);
    if (!messageContent.emotions) {
      console.warn('No emotions found in the message content:', messageContent);
      return [];
    }
    const emotions = messageContent.emotions;
    const sortedEmotions = emotions.sort((a, b) => b.emotion_score - a.emotion_score);
    return sortedEmotions;
  } catch (error) {
    console.warn('Failed to extract and sort emotions:', error);
    return [];
  }
};

const processRealtimeMessage = (message) => {
  try {
    const data = JSON.parse(message);
    if (data.type === 'realtime' && data.text) {
      console.log('Realtime Text:', data.text);
      return { text: data.text, type: 'realtime' };
    } else if (data.type === 'realtime' && !data.text) {
      console.warn('Received empty realtime message');
      return { text: '', type: 'realtime' };
    } else if (typeof data === 'object') {
      console.log('Analyzing text emotions, a JSON is received');
      return null;
    } else {
      console.warn('Unexpected message format or type:', message);
      return null;
    }
  } catch (error) {
    console.error('Failed to process realtime message:', error);
    return null;
  }
};

const processFullSentenceMessage = (message) => {
  try {
    const data = JSON.parse(message);
    if (data.type === 'fullSentence' && data.result) {
      const result = JSON.parse(data.result);
      if (result.choices && result.choices[0].message && result.choices[0].message.content) {
        const sortedEmotions = extractAndSortEmotions(result);
        console.log('Sorted Emotions:', sortedEmotions);
        return { result: sortedEmotions, text: data.text, type: 'fullSentence' };
      } else {
        console.warn('No valid message content found:', result);
        return null;
      }
    } else {
      console.warn('Unexpected message format or type:', message);
      return null;
    }
  } catch (error) {
    // Do not log the exception
    return null;
  }
};

const AudioTextDisplay = () => {
  const audioSocketRef = useRef(null);
  const videoSocketRef = useRef(null);
  const reconnectInterval = 5000; // 5 seconds
  const isInitialized = useRef(false);
  const [audioText, setAudioText] = useState(null);
  const [audioResult, setAudioResult] = useState(null);
  const [videoText, setVideoText] = useState(null);

  useEffect(() => {
    const connectSocket = (url, ref, type, setText, setResult) => {
      if (ref.current && ref.current.readyState === WebSocket.OPEN) {
        return; // Avoid reconnecting if already connected
      }
      ref.current = new WebSocket(url);

      ref.current.onopen = () => {
        console.log(`${type} WebSocket connection opened`);
      };

      ref.current.onmessage = (e) => {
        console.log(`Receiving message from the ${type.toLowerCase()} server...`);
        let processedMessage = null;
        if (type === 'Audio') {
          processedMessage = processRealtimeMessage(e.data) || processFullSentenceMessage(e.data);
          if (processedMessage) {
            if (processedMessage.type === 'realtime') {
              setText(processedMessage.text);
            } else if (processedMessage.type === 'fullSentence') {
              setText(processedMessage.text);
              setResult(processedMessage.result);
            }
          }
        } else {
          const data = JSON.parse(e.data);
          setText(data);
        }
      };

      ref.current.onerror = (e) => {
        console.log(`An error occurred in the ${type.toLowerCase()} server: ${e.message}`);
      };

      ref.current.onclose = (e) => {
        console.log(`Shutting down the ${type.toLowerCase()} server...`);
        console.log(e.code, e.reason);
        setTimeout(() => connectSocket(url, ref, type, setText, setResult), reconnectInterval);
      };
    };

    const initializeConnections = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      const microphoneGranted = await requestPermission(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        'Resonate Microphone Permission',
        'Resonate needs access to your microphone so you can connect seamlessly with the world'
      );
      const cameraGranted = await requestPermission(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        'Resonate Camera Permission',
        'Resonate needs access to your camera so you can connect seamlessly with the world'
      );

      if (microphoneGranted && cameraGranted) {
        connectSocket('ws://192.168.1.4:8001', audioSocketRef, 'Audio', setAudioText, setAudioResult);
        connectSocket('ws://192.168.1.4:8002', videoSocketRef, 'Video', setVideoText);

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
          if (audioSocketRef.current && audioSocketRef.current.readyState === WebSocket.OPEN) {
            // Convert data to binary
            const audioData = Buffer.from(data, 'base64'); // Assuming data is in base64 format
            // Construct binary message as per server protocol
            const messageType = 'audio';
            const messageTypeBuffer = Buffer.alloc(5, ' '); // 5 bytes for the message type
            messageTypeBuffer.write(messageType);
            const metadata = JSON.stringify({ sampleRate: 16000 });
            const metadataBuffer = Buffer.from(metadata, 'utf-8');
            const metadataLengthBuffer = Buffer.alloc(4);
            metadataLengthBuffer.writeUInt32LE(metadataBuffer.length);
            const binaryMessage = Buffer.concat([messageTypeBuffer, metadataLengthBuffer, metadataBuffer, audioData]);

            // Send binary data
            audioSocketRef.current.send(binaryMessage);
          }
        });

        try {
          await AudioRecord.start();
          console.log('Recording started');
        } catch (err) {
          console.error('Error starting recording:', err);
        }
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
      AudioRecord.stop()
        .then(() => console.log('Recording stopped'))
        .catch(err => console.error('Error stopping recording:', err));
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>WebSocket Example</Text>
      {audioText && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Audio Text:</Text>
          <Text style={styles.dataText}>{audioText}</Text>
        </View>
      )}
      {audioResult && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Audio Analysis Result:</Text>
          <Text style={styles.dataText}>{JSON.stringify(audioResult, null, 2)}</Text>
        </View>
      )}
      {videoText && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Video Text:</Text>
          <Text style={styles.dataText}>{JSON.stringify(videoText, null, 2)}</Text>
        </View>
      )}
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
  dataContainer: {
    marginVertical: 8,
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataText: {
    fontSize: 16,
  },
});

export default AudioTextDisplay;
