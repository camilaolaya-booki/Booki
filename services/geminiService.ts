
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ExerciseType } from "../types";

// Note: API_KEY is managed externally via process.env.API_KEY
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateReadingExercise = async (type: ExerciseType, city: string) => {
  const ai = getAIClient();
  const prompt = `Genera un ejercicio de lectura para niños de 6 a 10 años en español sobre la ciudad de ${city}, Perú. 
  El tipo de ejercicio es: ${type}.
  Si es ELIGE_LA_PALABRA: Proporciona un texto corto con 3 huecos marcados como [___].
  Si es HALLA_EL_PROPOSITO: Proporciona un texto informativo y una pregunta sobre por qué se escribió.
  Si es RETO_SORPRESA: Genera una adivinanza o un reto creativo basado en la cultura de ${city}.
  Responde siempre en formato JSON.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                feedback: { type: Type.STRING }
              },
              required: ["text", "options", "correctAnswer"]
            }
          }
        },
        required: ["title", "content", "questions"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateStorySynopsis = async (storyName: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Genera una sinopsis muy corta y emocionante (máximo 2 oraciones) para un niño de 7 años sobre el cuento o leyenda peruana llamada: "${storyName}".`,
    config: {
      systemInstruction: "Eres Librito, un bibliotecario mágico. Habla de forma dulce y motivadora.",
    }
  });
  return response.text;
};

export const getLibritoResponse = async (userQuery: string, context: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Eres "Librito", un compañero de lectura amable para niños peruanos. 
    Contexto actual: ${context}.
    Pregunta del niño: ${userQuery}`,
    config: {
      systemInstruction: "Habla siempre en español de forma motivadora y sencilla. Usa modismos peruanos suaves como '¡Qué chévere!' o '¡Vale!'. Evita temas complejos.",
      thinkingConfig: { thinkingBudget: 16000 }
    }
  });

  return response.text;
};

export const generateStoryIllustration = async (prompt: string, size: "1K" | "2K" | "4K" = "1K") => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: `Ilustración infantil colorida estilo acuarela de: ${prompt}. Estilo amigable para niños.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: size
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
