"use client";

import FileUploadComponent from "./components/fileUpload";
import ChatWindow from "./components/ChatSection";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-6">
        <FileUploadComponent />
        <ChatWindow />
      </div>
    </div>
  );
}
