# Job Description Reader & Resume Coach

Next.js app that helps you:

1. Load a LinkedIn job description (URL fetch with **paste fallback**)
2. Upload a **PDF or DOCX** resume
3. See **prep topics** and **resume suggestions** (mock/heuristic analysis in v1)
4. **Accept or skip** each suggestion; changes apply one at a time
5. **Download** tailored **DOCX** or **PDF**

## Prerequisites (Windows)

If PowerShell says **`npm` is not recognized**, Node.js is not on your PATH.

**Option A — Official installer (recommended long-term)**  
Install [Node.js LTS](https://nodejs.org/) (includes npm). Close and reopen the terminal, then run `node -v` and `npm -v`.

**Option B — Portable Node (already set up on this machine)**  
Node v22 is at `%USERPROFILE%\.local\nodejs\node-v22.19.0-win-x64`. In PowerShell:

```powershell
. .\scripts\use-node.ps1   # from the project folder
npm install
npm run dev
```

Or add that folder to your user PATH in Windows Settings → System → About → Advanced system settings → Environment Variables.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env` when you add LLM support later.

## Limitations (v1)

### LinkedIn URL fetch

Server-side fetch often fails because LinkedIn shows a login wall or bot protection. The app always shows an error and lets you **paste the full job text** when fetch fails or returns too little content.

### Resume formatting

Parsing extracts **plain text** from PDF/DOCX. Export rebuilds a **clean** document; it is **not** a pixel-perfect copy of your original layout or styling.

### Analysis

v1 uses a **skill dictionary + gap heuristics** in [`lib/analysis/analyzeJobResume.ts`](lib/analysis/analyzeJobResume.ts). Suggestions are **templates** — edit accepted lines in the preview before downloading.

## Swapping in an LLM

Keep the public API of `analyzeJobResume(jobText, resumeText)` and return the same `AnalysisResult` type from [`lib/types/analysis.ts`](lib/types/analysis.ts). Example:

```ts
export async function analyzeJobResume(jobText: string, resumeText: string) {
  if (process.env.OPENAI_API_KEY) {
    // call model, parse JSON into AnalysisResult
  }
  return analyzeJobResumeHeuristic(jobText, resumeText);
}
```

Set `OPENAI_API_KEY` in `.env` when ready.

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/job/scrape` | `{ url }` → job text or error |
| POST | `/api/resume/parse` | `multipart/form-data` file → `{ text, format }` |
| POST | `/api/analyze` | `{ jobText, resumeText }` → prep + suggestions |
| POST | `/api/resume/export` | `{ resumeText, format: "docx" \| "pdf" }` → file |

Max upload size: **5MB**.

## Tests

```bash
npm test
```

## Privacy

Job and resume content are processed per request and **not stored** on the server in v1.
