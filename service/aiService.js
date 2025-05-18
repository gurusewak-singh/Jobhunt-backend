import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY; // Changed to GEMINI_API_KEY

export const callGemini = async (prompt) => { // Changed function name to callGemini
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, // Integrated API key directly in the URL
      {
        contents: [ // Changed 'messages' to 'contents' and adjusted the structure
          {
            role: 'user', // Gemini uses 'user' and 'model' roles
            parts: [{ text: prompt }], // Content is within the 'parts' array
          },
        ],
        generationConfig: { // Use generationConfig for parameters like maxOutputTokens
          maxOutputTokens: 1500,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.candidates[0].content.parts[0].text; // Adjusted to access the Gemini response structure
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};