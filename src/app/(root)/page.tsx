'use client';

import Navbar from "@/components/shared/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Bot, LineChart, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900 font-sans">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob" />
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now Live: AI-Powered Resume Scoring
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your Career, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Engineered by Intelligence.
            </span>
          </motion.h1>

          <motion.p 
            className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stop applying blindly. <strong>PathPilot</strong> unifies your placement journey, personalizes preparation, and connects you with the right opportunities.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/sign-up">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20">
                Student Login <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="#features">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold hover:bg-slate-50 transition-all">
                View Features
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION (Social Proof) */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Placement Rate", value: "88%" },
              { label: "Recruiting Partners", value: "500+" },
              { label: "Alumni Mentors", value: "1.2k" },
              { label: "Highest Package", value: "45 LPA" },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID (Problem Solvers) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Bridging the Gap Between <span className="text-blue-600">Talent & Industry</span>
            </h2>
            <p className="text-lg text-slate-600">
              We replaced generic guidance with stream-specific intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 hover:border-blue-100 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <Bot className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Career Assistant</h3>
              <p className="text-slate-600 leading-relaxed">
                Don&apos;t know where to start? Our AI analyzes your resume and suggests tailored roadmaps specific to your branch—be it Engineering or Pharmacy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 hover:border-purple-100 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                <LineChart className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Tracking</h3>
              <p className="text-slate-600 leading-relaxed">
                No more guessing. Track your application status from &quot;Applied&quot; to &quot;Offer Letter&quot; in a transparent, Trello-style pipeline.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-200/50 hover:border-pink-100 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 flex items-center justify-center mb-6 group-hover:bg-pink-600 transition-colors">
                <Users className="w-6 h-6 text-pink-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Alumni Connect</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect with seniors working in your dream companies. Get referrals, interview tips, and industry insights directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl mb-6">
                Streamlined for Success
              </h2>
              <p className="text-slate-400 text-lg mb-8">
                The system adapts to your department. Engineering students see coding challenges, while Business students get case studies.
              </p>
              
              <div className="space-y-6">
                {[
                  "Create your profile and upload resume",
                  "AI suggests relevant job roles & skills",
                  "Apply to companies with one click",
                  "Prepare with curated resources",
                  "Track interview progress in real-time"
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-slate-300 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              {/* Realistic Dashboard Mockup */}
              <div className="relative rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-2xl">
                {/* Window Header */}
                <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="text-slate-500 text-xs font-mono">My Applications</div>
                </div>

                {/* Job Cards UI */}
                <div className="space-y-4">
                  {/* Item 1: Offer Received */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-700/50 border border-slate-600/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-24 bg-slate-400 rounded-full mb-2"></div>
                      <div className="h-2 w-16 bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                      Offer
                    </div>
                  </div>

                  {/* Item 2: Interview Scheduled */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                      T
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-32 bg-slate-500 rounded-full mb-2"></div>
                      <div className="h-2 w-20 bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                      Interview
                    </div>
                  </div>

                  {/* Item 3: Applied */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-700/30 border border-slate-600/30 opacity-60">
                    <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                      G
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-28 bg-slate-500 rounded-full mb-2"></div>
                      <div className="h-2 w-12 bg-slate-600 rounded-full"></div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 text-xs font-bold">
                      Applied
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-10 -right-10 bg-white text-slate-900 p-4 rounded-xl shadow-xl hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase">Status</div>
                    <div className="font-bold">Resume Shortlisted</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
            Ready to Secure Your Future?
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Join students from Engineering, Business, and Pharmacy who are steering their careers with PathPilot.
          </p>
          <Link href="/sign-up">
            <button className="px-10 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 hover:scale-105 transform">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-900 font-bold text-lg">
            Path<span className="text-blue-600">Pilot</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2024 PathPilot. All rights reserved. Built for the Hackathon.
          </div>
          <div className="flex gap-6">
             {/* Social placeholders */}
             <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"></div>
             <div className="w-8 h-8 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}