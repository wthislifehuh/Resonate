import { useState, useEffect } from 'react';
import { analyzeFacialExpression } from './facialAnalysis';
import { analyzeTextEmotion } from './textAnalysis';
import { useTextRecognition } from '../context/textContext';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

const useFusion = () => {
    const [emotion, setEmotion] = useState("");
    const { recognizedText } = useTextRecognition();
    const [base64Image, setBase64Image] = useState("");

    useEffect(() => {
        const readImage = async () => {
            try {
                const path = '/storage/emulated/0/Pictures/Resonate/AR_Screenshot.jpg'; // Update with the actual path to your image
                
                // Resize the image to smaller dimensions and lower quality
                const resizedImageUri = await ImageResizer.createResizedImage(path, 150, 150, 'JPEG', 50);
                const base64Data = await RNFS.readFile(resizedImageUri.uri, 'base64');
                
                setBase64Image(base64Data);
                console.log('Image successfully read and resized');
            } catch (error) {
                console.error("Error converting file to base64: ", error);
            }
        };

        readImage();
    }, []); // Empty dependency array ensures this runs once on mount

    useEffect(() => {
        const aggregateEmotions = (audioResponse, videoResponse) => {
            const audioWeight = 0.3;
            const videoWeight = 0.7;
        
            const emotions = ["joy", "neutral", "sad", "surprised", "angry", "fear"];
            let aggregatedEmotions = emotions.map(emotion => {
                const audioEmotion = audioResponse.emotions.find(e => e.emotion === emotion);
                const videoEmotion = videoResponse.emotions.find(e => e.emotion === emotion);
                
                const audioScore = audioEmotion ? audioEmotion.emotion_score : 0;
                const videoScore = videoEmotion ? videoEmotion.emotion_score : 0;
                
                const weightedScore = audioScore * audioWeight + videoScore * videoWeight;
                
                return {
                    emotion: emotion,
                    emotion_score: weightedScore
                };
            });
        
            aggregatedEmotions.sort((a, b) => b.emotion_score - a.emotion_score);
        
            return aggregatedEmotions[0];
        };

        const processEmotion = async () => {
            if (!base64Image) {
                console.error('No base64 image found in context');
                setEmotion("No face detected.");
                return;
            }

            try {
                const imageResult = await analyzeFacialExpression(base64Image);
                const textResult = await analyzeTextEmotion(recognizedText);

                // if (Array.isArray(imageResult) && imageResult.length === 0 && 
                //     Array.isArray(textResult) && textResult.length === 0) {
                //     setEmotion("Pending...");
                //     return;
                // }

                if (imageResult && imageResult.emotions && imageResult.emotions.length > 0 && 
                    textResult && textResult.emotions && textResult.emotions.length > 0) {
                    const aggregatedEmotion = aggregateEmotions(textResult, imageResult);
                    setEmotion(aggregatedEmotion.emotion);
                } else if ((!imageResult || !imageResult.emotions || imageResult.emotions.length === 0) && 
                           textResult && textResult.emotions && textResult.emotions.length > 0) {
                    textResult.emotions.sort((a, b) => b.emotion_score - a.emotion_score);
                    setEmotion(textResult.emotions[0].emotion);
                } else if (imageResult && imageResult.emotions && imageResult.emotions.length > 0 && 
                           (!textResult || !textResult.emotions || textResult.emotions.length === 0)) {
                    imageResult.emotions.sort((a, b) => b.emotion_score - a.emotion_score);
                    setEmotion(imageResult.emotions[0].emotion);
                } else if ((!imageResult || !imageResult.emotions || imageResult.emotions.length === 0) && 
                           (!textResult || !textResult.emotions || textResult.emotions.length === 0)) {
                    setEmotion("Pending...");
                } else {
                    setEmotion("Pending...");
                }
            } catch (error) {
                console.error('An error occurred during emotion processing:', error);
                setEmotion("Error");
            }
        };

        processEmotion();
        console.log("Emotion:", emotion);
    }, [base64Image, recognizedText]); // Run when base64Image or recognizedText changes

    return { emotion };
    
};

export default useFusion;
