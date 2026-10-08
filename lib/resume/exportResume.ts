import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function linesToDocParagraphs(text: string): Paragraph[] {
  return text.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return new Paragraph({ children: [new TextRun("")], spacing: { after: 120 } });
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

export async function exportDocx(resumeText: string): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: linesToDocParagraphs(resumeText),
      },
    ],
  });
  return Packer.toBuffer(doc);
}

export async function exportPdf(resumeText: string): Promise<Uint8Array> {
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
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.15),
      });
      y -= lineHeight;
    }
  }

  return pdfDoc.save();
}

export function exportFilename(format: "docx" | "pdf"): string {
  const date = new Date().toISOString().slice(0, 10);
  return `resume-tailored-${date}.${format}`;
}
