import { useEffect, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Text,ScrollView } from "react-native";

const audioRecorderPlayer = new AudioRecorderPlayer();
const serverCheckInterval = 5000; // Check every 5 seconds

const useClientAudio = () => {
  const [text, setText] = useState("");
  const [serverAvailable, setServerAvailable] = useState(false);
  const [micAvailable, setMicAvailable] = useState(false);
  const [fullSentences, setFullSentences] = useState([]);
  let socket;
  let audioContext;
  let processor;

  useEffect(() => {
    connectToServer();
    requestMicrophonePermission();
    const intervalId = setInterval(() => {
      if (!serverAvailable) {
        connectToServer();
      }
    }, serverCheckInterval);
    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const connectToServer = () => {
    console.log("Connecting to WebSocket server...");
    socket = new WebSocket("ws://192.168.1.4:8001");

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
      setServerAvailable(true);
      setText("🖥️  Connected to server successfully  🖥️");
      startMessage();
    };

    socket.onmessage = (event) => {
      console.log("Received message from server", event.data);
      const data = JSON.parse(event.data);

      if (data.type === "realtime") {
        setText((prevText) => updateDisplayText(prevText, data.text));
      } else if (data.type === "fullSentence") {
        setFullSentences((prevSentences) => [...prevSentences, data.text]);
        setText((prevText) => updateDisplayText(prevText, ""));
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setServerAvailable(false);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setServerAvailable(false);
      setText("🖥️  Connection to server lost  🖥️");
    };
  };

  const requestMicrophonePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "App needs access to your microphone to record audio.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setMicAvailable(true);
          startMessage();
        } else {
          setMicAvailable(false);
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      setMicAvailable(true);
      startMessage();
    }
  };

  const startMessage = () => {
    if (!micAvailable) {
      setText("🎤  Please allow microphone access  🎤");
    } else if (!serverAvailable) {
      setText("🖥️  Please start server  🖥️");
    } else {
      setText("👄  Start speaking  👄");
      startRecording();
    }
  };

  const startRecording = async () => {
    if (micAvailable) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        processor = audioContext.createScriptProcessor(256, 1, 1);

        source.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const outputData = new Int16Array(inputData.length);

          // Convert to 16-bit PCM
          for (let i = 0; i < inputData.length; i++) {
            outputData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
          }

          // Send the 16-bit PCM data to the server
          if (socket.readyState === WebSocket.OPEN) {
            // Create a JSON string with metadata
            const metadata = JSON.stringify({ sampleRate: audioContext.sampleRate });
            // Convert metadata to a byte array
            const metadataBytes = new TextEncoder().encode(metadata);
            // Create a buffer for metadata length (4 bytes for 32-bit integer)
            const metadataLength = new ArrayBuffer(4);
            const metadataLengthView = new DataView(metadataLength);
            // Set the length of the metadata in the first 4 bytes
            metadataLengthView.setInt32(0, metadataBytes.byteLength, true); // true for little-endian
            // Combine metadata length, metadata, and audio data into a single message
            const combinedData = new Blob([metadataLength, metadataBytes, outputData.buffer]);
            socket.send(combinedData);
          }
        };
      } catch (error) {
        console.error('Failed to start recording', error);
      }
    }
  };

  const updateDisplayText = (prevText, realtimeText) => {
    let displayedText = fullSentences
      .map((sentence, index) => {
        return `<span style="color:${index % 2 === 0 ? 'yellow' : 'cyan'}">${sentence} </span>`;
      })
      .join("") + realtimeText;

    return displayedText;
  };

  return text;
};

const AudioTextDisplay = () => {
  const text = useClientAudio();

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text>{text}</Text>
    </ScrollView>
  );
};

export default AudioTextDisplay;
