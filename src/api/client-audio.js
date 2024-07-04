import { useState, useEffect } from "react";
import { useScreenshot } from './ScreenshotContext'; // Import the custom hook

const useClientAudio = () => {
  const { base64Image } = useScreenshot(); // Consume the base64 image from the context
  const [emotion, setEmotion] = useState("");
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    // Simulating fetching emotion and transcription from audio every 5 seconds
    const fetchAudioData = async () => {
      // Replace this with actual logic to get emotion and transcription from audio
      const newEmotion = "neutral"; // Dummy emotion data
      const newTranscription = "Sample transcription text"; // Dummy transcription data
      console.log("Setting emotion and transcription in useClientAudio:", newEmotion, newTranscription); // Debug log
      setEmotion(newEmotion);
      setTranscription(newTranscription);
      console.log("Base64 Image received in Client Audio:", base64Image.substr(0, 50)); // Debug log
    };
    
    fetchAudioData(); // Initial fetch

    const interval = setInterval(fetchAudioData, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [base64Image]);

  return { emotion, transcription, base64Image };
};

export default useClientAudio;
