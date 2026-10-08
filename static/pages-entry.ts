import { analyzeJobResume } from "@/lib/analysis/analyzeJobResume";
import mammoth from "mammoth/mammoth.browser.js";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const PDFJS_URL =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs";
const PDFJS_WORKER =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs";

function linesToDocParagraphs(text: string): Paragraph[] {
  return text.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return new Paragraph({
        children: [new TextRun("")],
        spacing: { after: 120 },
      });
    }
    const isHeading =
      /^[A-Z][A-Za-z\s/&]+$/.test(trimmed) &&
      trimmed.length < 40 &&
      !trimmed.startsWith("•");
    if (isHeading) {
      return new Paragraph({
        text: trimmed,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 240, after: 120 },
      });
    }
    return new Paragraph({
      children: [new TextRun(trimmed)],
      spacing: { after: 80 },
    });
  });
}

export async function parseDocx(buffer: ArrayBuffer): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  const text = (result.value ?? "").trim();
  if (!text) throw new Error("No text found in that DOCX.");
  return text;
}

export async function parsePdf(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import(/* @vite-ignore */ PDFJS_URL);
  pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item: { str?: string }) => item.str ?? "")
      .join(" ");
    parts.push(line);
  }
  const text = parts.join("\n").replace(/[ \t]+\n/g, "\n").trim();
  if (!text) throw new Error("No text found in that PDF.");
  return text;
}

export async function exportDocxBlob(resumeText: string): Promise<Blob> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: linesToDocParagraphs(resumeText),
      },
    ],
  });
  return Packer.toBlob(doc);
}

export async function exportPdfBlob(resumeText: string): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = fontSize * 1.35;
  const margin = 50;
  const pageWidth = 612;
  const pageHeight = 792;
  const maxWidth = pageWidth - margin * 2;

  let page = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;

  const wrapLine = (line: string): string[] => {
    const words = line.split(/\s+/);
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
      const test = current ? `${current} ${word}` : word;
      const width = font.widthOfTextAtSize(test, fontSize);
      if (width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.length ? lines : [""];
  };

  for (const rawLine of resumeText.split(/\r?\n/)) {
    const wrapped = wrapLine(rawLine);
    for (const line of wrapped) {
      if (y < margin) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - margin;
      }
      const safe = line.replace(/[^\x20-\x7E]/g, " ");
      page.drawText(safe, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.15),
      });
      y -= lineHeight;
    }
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes], { type: "application/pdf" });
}

export function exportFilename(format: "docx" | "pdf"): string {
  const date = new Date().toISOString().slice(0, 10);
  return `resume-tailored-${date}.${format}`;
}

export { analyzeJobResume };
