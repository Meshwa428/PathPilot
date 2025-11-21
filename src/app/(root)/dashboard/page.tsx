'use client';

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Users, 
  Bell,
  Search,
  Building2
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";

export default function Dashboard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock Data for the Hackathon Demo
  const stats = [
    { label: "Applications", value: "12", icon: Briefcase, color: "bg-blue-500" },
    { label: "Interviews", value: "3", icon: Users, color: "bg-purple-500" },
    { label: "Profile Score", value: "85%", icon: TrendingUp, color: "bg-green-500" },
    { label: "Resumes", value: "2", icon: FileText, color: "bg-orange-500" },
  ];

  const recommendedJobs = [
    { role: "Software Engineer", company: "TechCorp", location: "Bangalore", type: "Full-time" },
    { role: "Data Analyst", company: "FinData", location: "Mumbai", type: "Internship" },
    { role: "Product Trainee", company: "InnovateX", location: "Remote", type: "Full-time" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Welcome back, <span className="text-blue-600">{user?.firstName}</span>! 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening with your placement journey today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Job Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-slate-400" />
                Recommended Drives
              </h2>
              <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {recommendedJobs.map((job, i) => (
                <div key={i} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group cursor-pointer flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                      {job.company[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.role}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {job.company} • {job.location}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    {job.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Action Center */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Complete your Profile</h3>
              <p className="text-slate-300 text-sm mb-4">
                Your profile is 85% complete. Add your latest project to increase visibility.
              </p>
              <button className="w-full py-2 bg-white text-slate-900 rounded-lg font-semibold text-sm hover:bg-slate-100 transition-colors">
                Update Profile
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors flex items-center gap-3">
                  <Search className="w-4 h-4" /> Search Companies
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 text-slate-600 text-sm font-medium transition-colors flex items-center gap-3">
                  <FileText className="w-4 h-4" /> Upload Resume
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}