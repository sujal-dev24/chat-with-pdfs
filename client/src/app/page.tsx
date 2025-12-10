// import { FileUp, Send, Plus } from "lucide-react";
// import FileUploadComponent from "./components/fileUpload";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <div className="container mx-auto max-w-7xl h-screen p-8">
//         <div className="flex flex-col lg:flex-row gap-8 h-full">
//           <FileUploadComponent />
          
//           {/* Right Section - AI Chat */}
//           <div className="flex-1 h-full bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-md">
//             <div className="h-full flex flex-col p-6">
//               <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400 bg-clip-text text-transparent mb-6">
//                 Chat with your PDFs
//               </h2>
              
//               {/* Chat Area */}
//               <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl shadow-inner mb-6 overflow-auto backdrop-blur-sm">
//                 <div className="h-full flex flex-col">
//                   <div className="flex-1 p-8">
//                     <div className="h-full flex flex-col items-center justify-center space-y-6">
//                       <div className="w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-violet-500/20 rounded-3xl flex items-center justify-center transform transition-transform hover:scale-105">
//                         <FileUp className="w-12 h-12 text-blue-600 dark:text-blue-400" />
//                       </div>
//                       <div className="text-center space-y-2">
//                         <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
//                           Start a Conversation
//                         </h3>
//                         <p className="text-gray-600 dark:text-gray-400 max-w-md">
//                           Upload a PDF document and ask questions about its content.
//                           I'm here to help you understand it better.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Message Input */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Type your question here..."
//                   className="w-full px-6 py-4 pr-14 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-gray-700 dark:text-gray-200"
//                   disabled
//                 />
//                 <button
//                   className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
//                   disabled
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// import FileUploadComponent from "./components/fileUpload";
// import ChatSection from "./components/ChatSection";

// export default function Home() {
//   return (
//     <div className="min-h-screen">
//       <div className="container mx-auto max-w-7xl h-screen p-8">
//         <div className="flex flex-col lg:flex-row gap-8 h-full">
//           <FileUploadComponent />
//           <ChatSection />
//         </div>
//       </div>
//     </div>
//   );
// }






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
