import { NextResponse } from "next/server";
import { z } from "zod";
import { scrapeJobDescription } from "@/lib/job/scrapeJobDescription";

const bodySchema = z.object({
  url: z.string().min(1).max(2048),
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
      { error: "URL is required.", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await scrapeJobDescription(parsed.data.url);
  return NextResponse.json(result);
}
