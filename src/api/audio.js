import { useState, useEffect } from "react";
import { useTextRecognition } from './TextRecognitionContext';

const useClientAudio = () => {
  const { recognizedText } = useTextRecognition();
  const [emotion, setEmotion] = useState("");
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    // Simulating fetching emotion and transcription from audio every 5 seconds
    const fetchAudioData = async () => {
      // Replace this with actual logic to get emotion and transcription from audio
      const newEmotion = "neutral"; // Dummy emotion data
      const newTranscription = recognizedText; // Use the recognized text from context
      console.log("Setting emotion and transcription in useClientAudio:", newEmotion, newTranscription); // Debug log
      setEmotion(newEmotion);
      setTranscription(newTranscription);
    };
    
    fetchAudioData(); // Initial fetch

    const interval = setInterval(fetchAudioData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [recognizedText]);

  return { emotion, transcription };
};

export default useClientAudio;
