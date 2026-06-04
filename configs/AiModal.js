import { GoogleGenerativeAI } from "@google/generative-ai";
import { EXPO_GOOGLE_GEMINI_API_KEY } from "@env";

const geminiKey = EXPO_GOOGLE_GEMINI_API_KEY?.trim();

if (!geminiKey || (!geminiKey.startsWith("AIza") && !geminiKey.startsWith("AQ."))) {
  throw new Error(
    "Invalid Gemini API key. Paste your key from aistudio.google.com/apikey into .env as EXPO_GOOGLE_GEMINI_API_KEY, then run: npx expo start -c"
  );
}

const genAI = new GoogleGenerativeAI(geminiKey);

const MODELS = ["gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  const message = error?.message || "";
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("high demand") ||
    message.includes("overloaded") ||
    message.includes("UNAVAILABLE")
  );
};

export const generateTripPlan = async (prompt) => {
  let lastError;

  for (const modelName of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig,
        });
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (error) {
        lastError = error;
        console.warn(`Model ${modelName} attempt ${attempt} failed:`, error.message);
        if (isRetryableError(error) && attempt < 3) {
          await sleep(attempt * 2000);
          continue;
        }
        // Exit the retry attempt loop to fall back to the next model
        break;
      }
    }
  }

  throw lastError || new Error("Failed to generate trip plan using any of the available models.");
};
