import fetch from 'node-fetch';

// Load the OpenAI API key from environment variables
const apiKey = 'API_KEY';

/**
 * Analyzes the emotion of a facial expression from a base64-encoded image.
 *
 * @param {string} base64Image - The base64-encoded image to be analyzed.
 * @returns {Promise<Object>} - A promise that resolves to an object with the detected emotion and its confidence score if successful, otherwise null.
 */
async function analyzeFacialExpression(base64Image) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const payload = {
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are an expert in facial expression emotion analysis." },
                {
                role: "user",
                content: [
                    { type: "text", text: `
                        Analyse the emotion of facial expression from the imagebase64 provided. The emotions could be expressed in the following: joy, sad, surprised, angry, fear, neutral. Provide emotions confidence score on a scale of 0 to 1, which confidence score of all emotions should sum up to 1. You must only return a JSON array as the result, with the example format: {"emotions": [{"emotion": "joy", "emotion_score": 0.9}, {"emotion": "neutral", "emotion_score": 0.1}, {"emotion": "sad", "emotion_score": 0}, {"emotion": "surprised", "emotion_score": 0}, {"emotion": "angry", "emotion_score": 0}, {"emotion": "fear", "emotion_score": 0}]}. If there is no visible face detected, return []. 
                    `, },
                    { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
                ]
                }
            ],
            temperature: 0,
            max_tokens: 1000,
        };

        console.log('Payload:', JSON.stringify(payload, null, 2)); // Log the payload for debugging

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices.length) {
            throw new Error('Unexpected API response format: choices not found');
        }

        // Extract the content from the message
        const messageContent = data.choices[0].message.content.trim();

        // Ensure the content is a valid JSON string
        if (messageContent.startsWith('{') || messageContent.startsWith('[')) {
            const emotionsArray = JSON.parse(messageContent);
            console.log("Facial emotion: ", emotionsArray);
            return emotionsArray;
        } else {
            console.error('Unexpected response format:', messageContent);
            return null;
        }
    } catch (error) {
        console.error('An error occurred in facialAnalysis:', error);
        return null;
    }
}

export { analyzeFacialExpression };
