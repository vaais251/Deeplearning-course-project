import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, ChatMessage } from '../types';

const MODEL_ID = "gemini-2.5-flash";

// Helper to get authenticated client safely
const getAiClient = () => {
  // strictly use process.env.API_KEY as configured in the environment (e.g. Vercel)
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("API Key not found in environment variables.");
  }
  
  // Use the API key exclusively from the environment variable
  return new GoogleGenAI({ apiKey: apiKey || '' });
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
  const prompt = `Design a comprehensive programming assignment (Lab) for the deep learning lesson "${lessonTitle}", styled like a Coursera or Stanford CS231n notebook.
  
  Structure the response in Markdown with the following sections:
  1. **Introduction**: Brief context.
  2. **Learning Objectives**: Bullet points.
  3. **Setup**: Dependencies to install.
  4. **Part 1: [Concept Name]**: Explanation followed by a coding exercise.
     - Include a code block with 'TODO' comments.
  5. **Part 2: [Next Concept]**: Advanced step.
  6. **Submission**: Instructions.

  Use distinct headers. Make the code blocks look like Python notebook cells.
  Keep the tone academic yet accessible (Karpathy style).`;

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