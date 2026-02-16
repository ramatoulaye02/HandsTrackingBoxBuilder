
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiStructure } from "../types";

// Generate a 3D voxel structure based on a user prompt using Gemini 3 Pro for complex spatial reasoning
export const generateVoxelStructure = async (prompt: string): Promise<GeminiStructure | null> => {
  try {
    // Initialize Gemini using the recommended constructor and environment variable
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a 3D voxel representation for: ${prompt}. Keep it within a 10x10x10 grid. Use hex colors.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            voxels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  x: { type: Type.INTEGER },
                  y: { type: Type.INTEGER },
                  z: { type: Type.INTEGER },
                  color: { type: Type.STRING }
                },
                required: ["x", "y", "z", "color"]
              }
            }
          },
          required: ["name", "voxels"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeminiStructure;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return null;
  }
};
