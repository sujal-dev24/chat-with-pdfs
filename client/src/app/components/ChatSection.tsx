// "use client";

// import { Send } from "lucide-react";
// import React, { useState } from "react";

// export default function ChatSection() {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMsg = { role: "user", content: input };
//     setMessages(prev => [...prev, userMsg]);

//     setLoading(true);

//     try {
//       const res = await fetch(
//         `http://localhost:8000/chat?message=${encodeURIComponent(input)}`
//       );

//       const data = await res.json();

//       const botMsg = {
//         role: "assistant",
//         content: data.messages,
//       };

//       setMessages(prev => [...prev, botMsg]);
//     } catch (err) {
//       setMessages(prev => [
//         ...prev,
//         { role: "assistant", content: "❌ Server Error. Try again." },
//       ]);
//     }

//     setInput("");
//     setLoading(false);
//   };

//   return (
//     <div className="flex-1 h-full bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md p-6 flex flex-col">
//       <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-6">
//         Chat with your PDFs
//       </h2>

//       {/* MESSAGES AREA */}
//       <div className="flex-1 overflow-y-auto bg-gray-100/60 dark:bg-gray-900/40 rounded-xl p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
//             Upload a PDF and start chatting...
//           </div>
//         ) : (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`p-3 rounded-xl max-w-xl ${
//                 msg.role === "user"
//                   ? "bg-blue-600 text-white ml-auto"
//                   : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//               }`}
//             >
//               {msg.content}
//             </div>
//           ))
//         )}

//         {loading && (
//           <div className="p-3 rounded-xl w-32 bg-gray-300 dark:bg-gray-700 animate-pulse text-gray-700 dark:text-gray-300">
//             Thinking...
//           </div>
//         )}
//       </div>

//       {/* INPUT BOX */}
//       <div className="relative mt-4">
//         <input
//           type="text"
//           value={input}
//           placeholder="Ask something from your PDF..."
//           onChange={(e) => setInput(e.target.value)}
//           className="w-full px-6 py-4 pr-14 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-gray-700 dark:text-gray-200"
//         />

//         <button
//           onClick={sendMessage}
//           disabled={loading}
//           className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
//         >
//           <Send className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:8000/chat?message=${encodeURIComponent(
          userMessage.content
        )}`
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: `${Date.now()}-bot`,
        role: "assistant",
        content: data.answer ?? "No answer returned.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError("Server Error. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) handleSend();
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-950/70 rounded-3xl border border-slate-800 shadow-xl flex flex-col">
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-100">
          Chat with your PDFs
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Upload a PDF on the left, then ask any question about its content.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">
            Ask a question like{" "}
            <span className="ml-1 italic text-slate-300">
              "Give me a summary of this PDF"
            </span>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-slate-900 text-slate-100 border border-slate-800"
            }`}
          >
            {m.content}
          </div>
        ))}

        {error && (
          <div className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/40 rounded-xl px-3 py-2 inline-flex">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-5 pt-3 border-t border-slate-800">
        <div className="relative">
          <input
            type="text"
            placeholder="Ask something about your PDF..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-4 pr-12 py-3 text-sm text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/60"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={isSending || !input.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-xl px-3 py-2 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs gap-1"
          >
            {isSending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="w-3 h-3" />
                Send
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
