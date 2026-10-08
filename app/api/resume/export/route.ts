import { NextResponse } from "next/server";
import { z } from "zod";
import {
  exportDocx,
  exportPdf,
  exportFilename,
} from "@/lib/resume/exportResume";

const bodySchema = z.object({
  resumeText: z.string().min(1).max(200_000),
  format: z.enum(["docx", "pdf"]),
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { resumeText, format } = parsed.data;
  const filename = exportFilename(format);

  try {
    if (format === "docx") {
      const buffer = await exportDocx(resumeText);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }

    const bytes = await exportPdf(resumeText);
    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed." }, { status: 500 });
  }
}
