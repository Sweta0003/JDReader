import mammoth from "mammoth";

export type ParsedResume = {
  text: string;
  format: "pdf" | "docx";
  sections?: Record<string, string>;
};

const SECTION_HEADINGS = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
];

function splitSections(text: string): Record<string, string> | undefined {
  const lines = text.split(/\r?\n/);
  const sections: Record<string, string> = {};
  let current: string | null = null;
  const buf: string[] = [];

  const flush = () => {
    if (current && buf.length) {
      sections[current] = buf.join("\n").trim();
    }
    buf.length = 0;
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const lower = trimmed.toLowerCase().replace(/:$/, "");
    if (SECTION_HEADINGS.includes(lower)) {
      flush();
      current = lower;
      continue;
    }
    if (current) buf.push(line);
  }
  flush();

  return Object.keys(sections).length > 0 ? sections : undefined;
}

export async function parseResumeBuffer(
  buffer: Buffer,
  filename: string
): Promise<ParsedResume> {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".docx")) {
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value.trim();
    return {
      text,
      format: "docx",
      sections: splitSections(text),
    };
  }

  if (lower.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    const text = (data.text as string).trim();
    return {
      text,
      format: "pdf",
      sections: splitSections(text),
    };
  }

  throw new Error("Unsupported file type. Upload PDF or DOCX.");
}
