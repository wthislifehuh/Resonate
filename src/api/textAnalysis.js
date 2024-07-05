import fetch from 'node-fetch';

// Load the OpenAI API key from environment variables
const apiKey = 'sk-proj-o20LwZHgy0vWmzmAJH79T3BlbkFJ7olU1ITNkMKSwf3xDSVQ';

/**
 * Analyzes the emotions of a given text.
 *
 * @param {string} text - The text to be analyzed.
 * @returns {Promise<Object>} - A promise that resolves to an object with the detected emotion and its confidence score if successful, otherwise null.
 */
async function analyzeTextEmotion(text) {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        };

        const payload = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: `
                        You are an expert in text emotion analysis. Analyze the emotions of sentence provided. The emotions could be expressed in the following: joy, sad, surprised, angry, fear, neutral. Provide emotions confidence score on a scale of 0 to 1, and the confidence score of all emotions should sum up to 1. Return a JSON array as the result, with the example format: {"emotions": [{"emotion": "joy", "emotion_score": 0.9}, {"emotion": "neutral", "emotion_score": 0.1}, {"emotion": "sad", "emotion_score": 0}, {"emotion": "surprised", "emotion_score": 0}, {"emotion": "angry", "emotion_score": 0}, {"emotion": "fear", "emotion_score": 0}]}. Output the results of all the emotions and their score in descending order of the score, even if the emotion has an emotion_score of 0. If there is no sentence provided, return [].
                    `,
                },
                { role: 'user', content: text },
            ],
            temperature: 0,
            max_tokens: 200,
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        // Extract the content from the message
        const messageContent = data.choices[0].message.content;

        // Parse the JSON string into an object
        const emotionsArray = JSON.parse(messageContent);

        console.log("Text emotion", emotionsArray);
        
        return emotionsArray;

    } catch (error) {
        console.error('An error occurred in textAnalysis:', error);
        return null;
    }
}

export { analyzeTextEmotion };
