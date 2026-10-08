import * as cheerio from "cheerio";
import { isScrapeUrlAllowed } from "@/lib/job/urlSafety";

const MIN_USEFUL_TEXT = 200;
const FETCH_TIMEOUT_MS = 15_000;

const USER_AGENT =
  "Mozilla/5.0 (compatible; JobDescReader/1.0; +https://localhost)";

function normalizeLinkedInJobUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.replace(/^www\./, "") === "linkedin.com") {
      parsed.searchParams.delete("trk");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

function extractFromJsonLd(html: string): string | null {
  const $ = cheerio.load(html);
  let best: string | null = null;
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const raw = $(el).html();
      if (!raw) return;
      const data = JSON.parse(raw) as unknown;
      const nodes = Array.isArray(data) ? data : [data];
      for (const node of nodes) {
        if (!node || typeof node !== "object") continue;
        const obj = node as Record<string, unknown>;
        const desc = obj.description;
        if (typeof desc === "string" && desc.length > (best?.length ?? 0)) {
          best = desc.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        }
        const graph = obj["@graph"];
        if (Array.isArray(graph)) {
          for (const item of graph) {
            if (item && typeof item === "object") {
              const d = (item as Record<string, unknown>).description;
              if (typeof d === "string" && d.length > (best?.length ?? 0)) {
                best = d.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
              }
            }
          }
        }
      }
    } catch {
      /* ignore invalid JSON-LD */
    }
  });
  return best;
}

function extractTextFromHtml(html: string): string {
  const fromLd = extractFromJsonLd(html);
  if (fromLd && fromLd.length >= MIN_USEFUL_TEXT) {
    return fromLd;
  }

  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, noscript").remove();

  const selectors = [
    ".description__text",
    ".show-more-less-html__markup",
    "[class*='description']",
    "main",
    "article",
  ];

  for (const sel of selectors) {
    const el = $(sel).first();
    if (el.length) {
      const t = el.text().replace(/\s+/g, " ").trim();
      if (t.length >= MIN_USEFUL_TEXT) return t;
    }
  }

  const body = $("body").text().replace(/\s+/g, " ").trim();
  return body;
}

export type ScrapeResult = {
  text?: string;
  error?: string;
  usedFallback: boolean;
};

export async function scrapeJobDescription(url: string): Promise<ScrapeResult> {
  const allowed = isScrapeUrlAllowed(url);
  if (!allowed.ok) {
    return {
      usedFallback: true,
      error: allowed.error,
    };
  }

  const normalized = normalizeLinkedInJobUrl(url);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(normalized, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
    });

    if (!res.ok) {
      return {
        usedFallback: true,
        error: `Could not fetch page (HTTP ${res.status}). Paste the job description below.`,
      };
    }

    const html = await res.text();
    const text = extractTextFromHtml(html);

    if (text.length < MIN_USEFUL_TEXT) {
      return {
        usedFallback: true,
        error:
          "Fetched page did not contain enough job text (LinkedIn may require login). Paste the description manually.",
        text: text.length > 0 ? text : undefined,
      };
    }

    return { text, usedFallback: false };
  } catch (e) {
    const message =
      e instanceof Error && e.name === "AbortError"
        ? "Request timed out."
        : "Failed to fetch job URL.";
    return {
      usedFallback: true,
      error: `${message} Paste the job description below.`,
    };
  } finally {
    clearTimeout(timeout);
  }
}
