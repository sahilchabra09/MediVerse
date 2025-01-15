'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";
import PDFParser from 'pdf-parse';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Function to convert file to base64
async function fileToBase64(file: ArrayBuffer): Promise<string> {
  const buffer = Buffer.from(file);
  return buffer.toString('base64');
}

// Extract text from PDF
async function extractTextFromPDF(fileBuffer: ArrayBuffer): Promise<string> {
  const data = await PDFParser(Buffer.from(fileBuffer));
  return data.text;
}

// Extract text from image
async function extractTextFromImage(fileBuffer: ArrayBuffer): Promise<string> {
  const base64 = await fileToBase64(fileBuffer);
  const result = await Tesseract.recognize(
    `data:image/jpeg;base64,${base64}`,
    'eng'
  );
  return result.data.text;
}

// Get summary from Gemini
async function getSummaryFromGemini(text: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const prompt = `Please provide a concise summary of the following text: ${text}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Main server action function
export async function processFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    // Convert File to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    let extractedText: string;

    // Process based on file type
    if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPDF(fileBuffer);
    } else if (file.type.startsWith('image/')) {
      extractedText = await extractTextFromImage(fileBuffer);
    } else {
      throw new Error('Unsupported file format');
    }

    // Get summary from Gemini
    const summary = await getSummaryFromGemini(extractedText);
    return { success: true, summary };

  } catch (error) {
    console.error('Error processing file:', error);
    return { success: false, error: (error as Error).message };
  }
} 