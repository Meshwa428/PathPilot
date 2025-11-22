'use client';

import { useState } from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { Compass, LayoutDashboard, LogIn, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Path<span className="text-blue-600">Pilot</span>
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</Link>
            <Link href="/#mentorship" className="hover:text-blue-600 transition-colors">Mentorship</Link>
          </div>

          {/* --- DESKTOP AUTH BUTTONS (Hidden on Mobile) --- */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all font-medium text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-3">
                <Link 
                  href="/sign-in"
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium text-sm px-4 py-2 rounded-full transition-all"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                >
                  Get Started <LogIn className="w-4 h-4" />
                </Link>
              </div>
            </SignedOut>
          </div>

          {/* --- MOBILE MENU TOGGLE BUTTON --- */}
          <div className="md:hidden flex items-center gap-4">
            {/* Show UserButton even on mobile if signed in */}
            <SignedIn>
                <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-4 space-y-4">
            
            {/* Mobile Links */}
            <Link 
              href="/#features" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-600 font-medium py-2 hover:text-blue-600 border-b border-slate-100"
            >
              Features
            </Link>
            <Link 
              href="/#how-it-works" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-600 font-medium py-2 hover:text-blue-600 border-b border-slate-100"
            >
              How it Works
            </Link>
            <Link 
              href="/#mentorship" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-slate-600 font-medium py-2 hover:text-blue-600 border-b border-slate-100"
            >
              Mentorship
            </Link>

            {/* Mobile Auth Buttons */}
            <SignedIn>
              <Link 
                href="/dashboard" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-xl font-bold mt-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </SignedIn>

            <SignedOut>
              <div className="flex flex-col gap-3 mt-2">
                <Link 
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link 
                  href="/sign-up"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  Get Started <LogIn className="w-4 h-4" />
                </Link>
              </div>
            </SignedOut>

          </div>
        </div>
      )}
    </nav>
  );
}