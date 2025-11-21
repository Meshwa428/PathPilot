'use client';

import { UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { GraduationCap, LayoutDashboard, LogIn } from "lucide-react";

export default function Navbar() {
  const { userId } = useAuth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              ITMBU<span className="text-blue-600">Placement</span>
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="#mentorship" className="hover:text-blue-600 transition-colors">Alumni Mentorship</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {userId ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all font-medium text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in">
                  <button className="text-slate-600 hover:text-slate-900 font-medium text-sm px-3 py-2">
                    Sign In
                  </button>
                </Link>
                <Link href="/sign-up">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20">
                    Get Started <LogIn className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}