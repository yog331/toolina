
import { GoogleGenAI } from "@google/genai";

// Always use named parameter and direct process.env.API_KEY as per guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askAssistant = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      // Use standard model name for flash lite or gemini-3-flash-preview for text tasks
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are the Toolina Assistant. 
        You help users find and understand digital tools on our platform.
        Tools available: Rajasthan Salary, Central Salary, BMI, Age, QR Generator, CSV to JSON, etc.
        Keep answers helpful, concise, and professional.
        If asked for a calculation you can't perform, suggest using one of our specific tools.`,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Assistant error:", error);
    return "I'm having trouble connecting right now. Please try using our manual tools below.";
  }
};
