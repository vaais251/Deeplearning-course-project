import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, ChatMessage } from '../types';

const MODEL_ID = "gemini-2.5-flash";
const HARDCODED_KEY = "AIzaSyDGBZS1uod4BNdmv4BvYi5p-b8P05dQ60U";

// Helper to get authenticated client safely
const getAiClient = () => {
  // 1. Try safe access to window.process (setup by index.html)
  // 2. Fallback to global process if defined (Node/Build env)
  // 3. Fallback to hardcoded key provided by user
  let apiKey = HARDCODED_KEY;

  try {
    if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      apiKey = (window as any).process.env.API_KEY;
    } else if (typeof process !== 'undefined' && process.env?.API_KEY) {
      apiKey = process.env.API_KEY;
    }
  } catch (e) {
    // Ignore env access errors
  }

  if (!apiKey) {
    throw new Error("API Key not found.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Generates a quiz for a specific lesson using Gemini.
 */
export const generateLessonQuiz = async (lessonTitle: string): Promise<Quiz> => {
  const prompt = `Create a challenging 3-question multiple choice quiz for the deep learning lesson titled: "${lessonTitle}". 
  Focus on conceptual understanding and technical details taught by Andrej Karpathy.`;

  // Define schema without importing the Type interface to avoid potential build issues with strict types
  const quizSchema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            question: { type: Type.STRING },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctOptionIndex: { type: Type.INTEGER, description: "Zero-based index of the correct option" }
          },
          required: ["id", "question", "options", "correctOptionIndex"]
        }
      }
    },
    required: ["questions"]
  };

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.3, 
      },
    });

    if (response.text) {
        return JSON.parse(response.text) as Quiz;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Error generating quiz:", error);
    return {
      questions: [
        {
          id: 1,
          question: "What is the primary goal of backpropagation?",
          options: ["To initialize weights", "To calculate gradients", "To normalize data", "To generate tokens"],
          correctOptionIndex: 1
        },
         {
          id: 2,
          question: "Failed to load AI quiz. Please check your connection.",
          options: ["Retry", "Ignore", "Report", "Sleep"],
          correctOptionIndex: 0
        }
      ]
    };
  }
};

/**
 * Generates a programming assignment for a lesson.
 */
export const generateAssignment = async (lessonTitle: string): Promise<string> => {
  const prompt = `Design a concise python programming assignment for the lesson "${lessonTitle}". 
  Include:
  1. A clear objective.
  2. Step-by-step instructions.
  3. A starter code snippet.
  Format the output in clean Markdown.
  Keep it similar to Karpathy's teaching style: code-first, intuitive.`;

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });
    return response.text || "Could not generate assignment.";
  } catch (error) {
    console.error("Assignment gen error", error);
    return "## Error \n\nUnable to generate assignment at this time. Please check your API key or internet connection.";
  }
};

/**
 * Generates a short, punchy explanation for the dashboard.
 */
export const explainLessonConcept = async (title: string, description: string): Promise<string> => {
    const prompt = `Provide a short, 2-sentence exciting summary of why a student must learn "${title}". 
    Context: ${description}. 
    Style: Technical but enthusiastic, like Andrej Karpathy.
    Mention the key technical 'aha' moment they will get.`;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: prompt,
        });
        return response.text || "Learn the magic of neural networks.";
    } catch (e) {
        return "This lesson is crucial for understanding modern AI architecture.";
    }
};

/**
 * Chat with the AI Tutor.
 */
export const chatWithTutor = async (
  currentMessage: string, 
  history: ChatMessage[], 
  lessonTitle: string
): Promise<string> => {
    const systemInstruction = `You are an expert AI Teaching Assistant for Andrej Karpathy's Deep Learning courses. 
    The user is currently studying: "${lessonTitle}".
    Answer their questions clearly, concisely, and using Python examples where relevant.
    Be encouraging but technically rigorous.`;

    const conversationContext = history.map(msg => `${msg.role === 'user' ? 'User' : 'Model'}: ${msg.text}`).join('\n');
    
    const fullPrompt = `${systemInstruction}\n\nConversation History:\n${conversationContext}\n\nUser: ${currentMessage}\nModel:`;

    try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
            model: MODEL_ID,
            contents: fullPrompt,
        });
        return response.text || "I'm pondering that...";
    } catch (error) {
        console.error("Chat error", error);
        return "I encountered an error connecting to the neural net.";
    }
};