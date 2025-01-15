import { NextResponse } from "next/server";
import formidable, { File as FormidableFile } from "formidable";
import { readFile } from "fs/promises";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Type for parsed form data
interface ParsedForm {
  fields: Record<string, string>;
  files: { [key: string]: FormidableFile };
}

// Helper to parse uploaded file
const parseForm = async (req: Request): Promise<ParsedForm> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({ keepExtensions: true });
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files } as ParsedForm);
    });
  });
};

// Extract text from PDF
const extractTextFromPDF = async (filePath: string): Promise<string> => {
  const pdfBytes = await readFile(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const textContent: string[] = [];
  const pages = pdfDoc.getPages();

  pages.forEach((page) => {
    const text = page.getTextContent().items.map((item: any) => item.str).join(" ");
    textContent.push(text);
  });

  return textContent.join("\n");
};

// Extract text from images using Tesseract
const extractTextFromImage = async (filePath: string): Promise<string> => {
  const result = await Tesseract.recognize(filePath, "eng");
  return result.data.text;
};

// Mock summarization function
const summarizeText = async (text: string): Promise<string> => {
  return `Summary: ${text.substring(0, 100)}...`;
};

// API handler for POST requests
export async function POST(req: Request) {
  try {
    const { files } = await parseForm(req);
    const file = files.file;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    let text: string;

    if (file.originalFilename?.endsWith(".pdf")) {
      text = await extractTextFromPDF(file.filepath);
    } else if (
      file.originalFilename?.endsWith(".jpg") ||
      file.originalFilename?.endsWith(".jpeg") ||
      file.originalFilename?.endsWith(".png")
    ) {
      text = await extractTextFromImage(file.filepath);
    } else {
      return NextResponse.json({ error: "Unsupported file format" }, { status: 400 });
    }

    const summary = await summarizeText(text);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
