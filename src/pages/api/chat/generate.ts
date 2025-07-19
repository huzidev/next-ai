// pages/api/chat/generate.ts
import { GoogleGenAI } from "@google/genai";
import type { NextApiRequest, NextApiResponse } from "next";

// Initialize the client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Extract message from request body
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    // Generate AI response using the new API structure
    console.log('Generating AI response for:', message);
    console.log('Using model: gemini-1.5-flash');
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Use a known working model
      contents: message,
    });

    console.log('AI response received:', response);
    const aiResponseText = response.text;

    res.status(200).json({ 
      success: true,
      message: aiResponseText
    });

  } catch (error: any) {
    console.error("Gemini error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to generate response" 
    });
  }
}
