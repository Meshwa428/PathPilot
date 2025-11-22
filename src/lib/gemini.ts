import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing GEMINI_API_KEY in .env");

const ai = new GoogleGenAI({ apiKey });

// 1. Generate Embedding (For RAG)
export async function generateEmbedding(text: string) {
  try {
    const response = await ai.models.embedContent({
      model: 'text-embedding-004', 
      contents: text,
    });
    return response.embedding?.values || response.embedding;
  } catch (error) {
    console.error("Embedding Error:", error);
    throw error;
  }
}

// 2. Generate Text (General Helper)
export async function generateText(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", 
      contents: prompt,
      config: { systemInstruction }
    });
    // ✅ FIXED: .text is a property
    return response.text || "";
  } catch (error) {
    console.error("Generation Error:", error);
    return "";
  }
}

// 3. Parse Resume PDF directly using Gemini 2.0 Flash
export async function analyzeResumePDF(fileBuffer: Buffer) {
  try {
    // Convert Buffer to Base64 for inline transmission
    const base64Data = fileBuffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Data
          }
        },
        {
          text: `
            You are an expert HR Data Analyst. 
            Analyze this resume PDF and extract two distinct distinct pieces of information:
            
            1. profile_summary: A concise professional summary (max 150 words) for a dashboard profile card. Highlight top skills and experience.
            2. search_content: A verbose, detailed text representation of the entire resume. Include every skill, project detail, educational course, and keyword found. This will be used for vector search.
          `
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", 
          properties: {
            profile_summary: { type: "STRING" },
            search_content: { type: "STRING" }
          }
        }
      }
    });

    // ✅ FIXED: Removed parentheses ()
    const text = response.text;
    
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini PDF Analysis Error:", error);
    throw new Error("Failed to analyze resume PDF");
  }
}