import { NextResponse } from "next/server";
import { z } from "zod";
import { analyzeJobResume } from "@/lib/analysis/analyzeJobResume";

const bodySchema = z.object({
  jobText: z.string().min(1).max(100_000),
  resumeText: z.string().max(100_000),
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

  try {
    const result = analyzeJobResume(parsed.data.jobText, parsed.data.resumeText);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Analysis failed.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
