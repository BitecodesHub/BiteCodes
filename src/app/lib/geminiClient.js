// lib/geminiClient.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("❌ GEMINI_API_KEY is not set in environment variables.");

  const genAI = new GoogleGenerativeAI(apiKey);

  // ✅ Latest text model for content/blog generation
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}

export function getGeminiImageModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("❌ GEMINI_API_KEY is not set in environment variables.");

  const genAI = new GoogleGenerativeAI(apiKey);

  // ✅ Use same Gemini 1.5 model, which supports inline image generation
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
}
