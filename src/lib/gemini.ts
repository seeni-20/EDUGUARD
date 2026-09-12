import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface StudentMetrics {
  attendance: number;
  marks: number;
  participation: number;
  extracurriculars: number;
  behaviorScore: number;
}

export interface PredictionResult {
  riskLevel: "Low" | "Moderate" | "High";
  probability: number;
  reasoning: string;
  recommendations: string[];
  factors: {
    name: string;
    impact: "Positive" | "Negative" | "Neutral";
    description: string;
  }[];
}

export async function predictDropoutRisk(metrics: StudentMetrics): Promise<PredictionResult> {
  const prompt = `Analyze the following student metrics and predict their dropout risk:
Attendance: ${metrics.attendance}%
Average Marks: ${metrics.marks}%
Class Participation: ${metrics.participation}/10
Extracurricular Activity: ${metrics.extracurriculars}/10
Behavior Score: ${metrics.behaviorScore}/10

Provide a detailed risk assessment in JSON format.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING, enum: ["Low", "Moderate", "High"] },
          probability: { type: Type.NUMBER, description: "Probability of dropout as a percentage (0-100)" },
          reasoning: { type: Type.STRING },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          factors: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ["Positive", "Negative", "Neutral"] },
                description: { type: Type.STRING }
              },
              required: ["name", "impact", "description"]
            }
          }
        },
        required: ["riskLevel", "probability", "reasoning", "recommendations", "factors"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return result as PredictionResult;
}
