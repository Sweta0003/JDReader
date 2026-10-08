"use client";

type Props = {
  workingText: string;
  onUndo: () => void;
  canUndo: boolean;
  onDownload: (format: "docx" | "pdf") => void;
  downloading: "docx" | "pdf" | null;
};

export function ResumePreview({
  workingText,
  onUndo,
  canUndo,
  onDownload,
  downloading,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
      <h2 className="text-lg font-semibold text-slate-900">Live resume preview</h2>
      <p className="mt-1 text-xs text-slate-500">
        Accepted changes apply here in order. Export uses this text (clean layout, not
        a pixel-perfect copy of your upload).
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Undo last accept
        </button>
        <button
          type="button"
          onClick={() => onDownload("docx")}
          disabled={!!downloading || !workingText.trim()}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {downloading === "docx" ? "Preparing…" : "Download DOCX"}
        </button>
        <button
          type="button"
          onClick={() => onDownload("pdf")}
          disabled={!!downloading || !workingText.trim()}
          className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-900 disabled:opacity-50"
        >
          {downloading === "pdf" ? "Preparing…" : "Download PDF"}
        </button>
      </div>

      <pre className="mt-4 max-h-[32rem] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
        {workingText || "(Upload a resume and accept suggestions to build preview)"}
      </pre>
    </section>
  );
}
