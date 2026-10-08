"use client";

type Props = {
  resumeText: string;
  fileName: string | null;
  loadingParse: boolean;
  previewOpen: boolean;
  onTogglePreview: () => void;
  onFile: (file: File) => void;
};

export function ResumeStep({
  resumeText,
  fileName,
  loadingParse,
  previewOpen,
  onTogglePreview,
  onFile,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">2. Your resume</h2>
      <p className="mt-1 text-sm text-slate-600">
        Upload PDF or DOCX. Layout may not match exactly after export — we work from
        extracted text.
      </p>

      <div className="mt-4">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 hover:border-indigo-400 hover:bg-indigo-50/30">
          <span className="text-sm font-medium text-slate-700">
            {loadingParse
              ? "Parsing…"
              : fileName
                ? `Uploaded: ${fileName}`
                : "Drop file or click to upload (PDF / DOCX, max 5MB)"}
          </span>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            disabled={loadingParse}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
      </div>

      {resumeText && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onTogglePreview}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {previewOpen ? "Hide" : "Show"} extracted text preview
          </button>
          {previewOpen && (
            <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-800 whitespace-pre-wrap">
              {resumeText}
            </pre>
          )}
        </div>
      )}
    </section>
  );
}
