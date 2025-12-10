// "use client";

// import { FileUp, Plus, CheckCircle, XCircle, Loader2, File } from 'lucide-react'
// import * as React from 'react'

// const FileUploadComponent: React.FC = () => {
//     const [uploadStatus, setUploadStatus] = React.useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
//     const [errorMessage, setErrorMessage] = React.useState<string>('');

//     const handleFileUploadBtn = () => {
//         const el = document.createElement("input");
//         el.setAttribute("type", "file");
//         el.setAttribute("accept", "application/pdf");
//         el.setAttribute("multiple", "true");
        
//         el.addEventListener("change", async (ev) => {
//             if (el.files && el.files.length > 0) {
//                 setUploadStatus('uploading');
//                 setErrorMessage('');
                
//                 try {
//                     for (let i = 0; i < el.files.length; i++) {
//                         const file = el.files.item(i);
//                         if (file) {
//                             const formdata = new FormData();
//                             formdata.append("pdf", file);

//                             const response = await fetch("http://localhost:8000/upload/pdf", {
//                                 method: "POST",
//                                 body: formdata
//                             });

//                             if (!response.ok) {
//                                 throw new Error(`Upload failed: ${response.statusText}`);
//                             }
//                         }
//                     }
//                     setUploadStatus('success');
//                     console.log("Files uploaded successfully");
//                 } catch (error) {
//                     setUploadStatus('error');
//                     setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
//                     console.error("Upload error:", error);
//                 }
//             }
//         });
//         el.click();    
//     }

//     return (
//         <div className="w-[350px] bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md overflow-hidden">
//             {/* Header */}
//             <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
//                 <div className="flex items-center justify-between">
//                     <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//                         Documents
//                     </h2>
//                     <button 
//                         onClick={handleFileUploadBtn}
//                         className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
//                     >
//                         <Plus className="w-5 h-5" />
//                     </button>
//                 </div>
//             </div>

//             {/* Upload Area */}
//             <div className="p-4">
//                 <div 
//                     onClick={handleFileUploadBtn}
//                     className={`
//                         relative rounded-xl p-6 text-center cursor-pointer border-2 border-dashed transition-all duration-300
//                         ${uploadStatus === 'uploading' ? 'border-blue-400/50 bg-blue-50/30 dark:bg-blue-900/10' :
//                         uploadStatus === 'success' ? 'border-green-400/50 bg-green-50/30 dark:bg-green-900/10' :
//                         uploadStatus === 'error' ? 'border-red-400/50 bg-red-50/30 dark:bg-red-900/10' :
//                         'border-gray-200 dark:border-gray-700 hover:border-blue-400/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10'}
//                     `}
//                 >
//                     <div className={`
//                         mx-auto mb-4 w-12 h-12 rounded-xl flex items-center justify-center
//                         ${uploadStatus === 'uploading' ? 'bg-blue-100 dark:bg-blue-900/30' :
//                         uploadStatus === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
//                         uploadStatus === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
//                         'bg-gray-100 dark:bg-gray-800'}
//                     `}>
//                         {uploadStatus === 'uploading' ? (
//                             <Loader2 className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" />
//                         ) : uploadStatus === 'success' ? (
//                             <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
//                         ) : uploadStatus === 'error' ? (
//                             <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
//                         ) : (
//                             <FileUp className="w-6 h-6 text-gray-600 dark:text-gray-400" />
//                         )}
//                     </div>

//                     <div className="space-y-2">
//                         <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                             {uploadStatus === 'uploading' ? 'Uploading...' :
//                             uploadStatus === 'success' ? 'Upload Complete!' :
//                             uploadStatus === 'error' ? 'Upload Failed' :
//                             'Drop PDFs here or click'}
//                         </p>
//                         {uploadStatus === 'idle' && (
//                             <p className="text-xs text-gray-500 dark:text-gray-400">
//                                 PDF files up to 10MB
//                             </p>
//                         )}
//                         {uploadStatus === 'error' && (
//                             <p className="text-xs text-red-500">{errorMessage}</p>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Recent Files List */}
//             <div className="px-4 pb-4">
//                 <div className="space-y-2">
//                     {uploadStatus === 'success' && (
//                         <div className="flex items-center gap-3 p-3 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg">
//                             <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
//                                 <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                                 <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
//                                     document.pdf
//                                 </p>
//                                 <p className="text-xs text-gray-500 dark:text-gray-400">
//                                     Just now • 2.4 MB
//                                 </p>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default FileUploadComponent




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

        const res = await fetch("http://localhost:8000/upload/pdf", {
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
