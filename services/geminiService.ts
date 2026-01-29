
import { GoogleGenAI } from "@google/genai";

export const generateTerminalContent = async (prompt: string): Promise<string | undefined> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("Missing API Key");
    return undefined;
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic terminal output or code sequence based on this description: "${prompt}".
      
      Requirements:
      1. ONLY return the text that would appear in a terminal.
      2. Include common prompts like "$" or ">".
      3. Use realistic command outputs (e.g., git logs, build steps, server responses).
      4. Do not include markdown code blocks or any explanation. Just raw terminal text.
      5. Max 20 lines.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text?.trim();
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw err;
  }
};
