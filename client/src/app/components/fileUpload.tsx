"use client";

import { Plus, CheckCircle2, Loader2, File } from "lucide-react";
import * as React from "react";

type Props = {
  onUploadSuccess?: (fileName: string) => void;
};

const FileUploadComponent: React.FC<Props> = ({ onUploadSuccess }) => {
  const [uploadStatus, setUploadStatus] =
    React.useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [lastFileName, setLastFileName] = React.useState<string | null>(null);

  const handleFileUploadBtn = () => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = "application/pdf";

    el.addEventListener("change", async () => {
      if (!el.files || el.files.length === 0) return;

      const file = el.files[0];
      setUploadStatus("uploading");
      setErrorMessage("");

      try {
        const formdata = new FormData();
        formdata.append("pdf", file);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/pdf`, {
          method: "POST",
          body: formdata,
        });

        if (!res.ok) {
          throw new Error(`Upload failed: ${res.statusText}`);
        }

        setUploadStatus("success");
        setLastFileName(file.name);
        onUploadSuccess?.(file.name);
      } catch (err) {
        setUploadStatus("error");
        setErrorMessage(
          err instanceof Error ? err.message : "Upload failed. Try again."
        );
      }
    });

    el.click();
  };

  return (
    <div className="w-[360px] bg-slate-950/70 rounded-3xl border border-slate-800 shadow-xl flex flex-col">
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">Documents</h2>
        <button
          onClick={handleFileUploadBtn}
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        <button
          onClick={handleFileUploadBtn}
          className={`w-full rounded-2xl border-2 border-dashed px-6 py-8 flex flex-col items-center justify-center gap-3 transition ${
            uploadStatus === "success"
              ? "border-emerald-500/60 bg-emerald-500/5"
              : uploadStatus === "uploading"
              ? "border-blue-500/60 bg-blue-500/5"
              : uploadStatus === "error"
              ? "border-red-500/60 bg-red-500/5"
              : "border-slate-700 hover:border-blue-500/60 hover:bg-slate-900/80"
          }`}
        >
          {uploadStatus === "uploading" ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          ) : uploadStatus === "success" ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          ) : (
            <File className="w-6 h-6 text-slate-300" />
          )}

          <div className="text-center">
            <p className="text-sm font-medium text-slate-100">
              {uploadStatus === "idle" && "Upload a PDF to get started"}
              {uploadStatus === "uploading" && "Uploading..."}
              {uploadStatus === "success" && "Upload Complete!"}
              {uploadStatus === "error" && "Upload failed"}
            </p>
            {uploadStatus === "idle" && (
              <p className="text-xs text-slate-400 mt-1">
                Click to select a PDF file
              </p>
            )}
            {uploadStatus === "error" && (
              <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
            )}
          </div>
        </button>
      </div>

      {lastFileName && (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-900/80 px-4 py-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <File className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-100 truncate">
                {lastFileName}
              </p>
              <p className="text-[11px] text-slate-400">Just now • PDF</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
