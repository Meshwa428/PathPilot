import { auth } from "@clerk/nextjs/server";
import { getUserById } from "../../../../../actions/user.action";
import { getResumeFeedback } from "../../../../../actions/resume.action";
import Navbar from "@/components/shared/Navbar";
import { Bot, AlertTriangle } from "lucide-react";
// We need a markdown parser for the response
import ReactMarkdown from 'react-markdown'; 

// Run: npm install react-markdown

export default async function FeedbackPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const student = await getUserById(userId);
  
  let feedback = "";
  if (student?.resume_url) {
    feedback = await getResumeFeedback(student.resume_url);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-900 selection:text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-24">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-red-600/20 rounded-full border border-red-600/50">
            <Bot className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Resume Roast</h1>
            <p className="text-slate-400">Prepare for reality. This is how recruiters actually see you.</p>
          </div>
        </div>

        {!student?.resume_url ? (
          <div className="p-8 bg-slate-900 rounded-2xl border border-slate-800 text-center">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white">No Resume Found</h3>
            <p className="text-slate-400 mt-2">Upload your resume in the dashboard first.</p>
          </div>
        ) : (
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-red-900/10">
               <ReactMarkdown>{feedback}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}