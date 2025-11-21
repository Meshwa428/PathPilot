'use client';

import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Changed background from slate-50 to slate-100 for better contrast
    <div className="min-h-screen w-full bg-slate-100 relative flex items-center justify-center overflow-hidden selection:bg-blue-100 selection:text-blue-700 font-sans">
      
      {/* --- Layer 1: High Contrast Grid Pattern --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Made the grid slightly darker (slate-300) so it's visible on slate-100 */}
        <div className="absolute h-full w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* --- Layer 2: Ambient Glow (Softer) --- */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[700px] h-[700px] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[700px] h-[700px] rounded-full bg-purple-400/10 blur-[100px]" />
      </div>

      {/* --- Top Navigation --- */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            Path<span className="text-blue-600">Pilot</span>
          </span>
        </Link>

        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> 
          <span className="hidden sm:inline">Back to Home</span>
        </Link>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-[450px] px-4">
        {children}
      </div>

      {/* --- Footer --- */}
      <div className="absolute bottom-6 text-slate-400 text-xs z-10 text-center w-full font-medium">
        © 2024 ITMBU Placement Cell. Secured by Clerk.
      </div>
    </div>
  );
}