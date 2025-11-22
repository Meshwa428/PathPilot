'use client';

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Briefcase, FileText, TrendingUp, Users, Star, GitFork, Github } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import ResumeUploader from "./ResumeUploader";
import EditProfileModal from "./EditProfileModal";
import JobCard from "./JobCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StudentDashboard({ student, repos, jobs }: { student: any, repos: any[], jobs: any[] }) {
    const { user } = useUser();

    const stats = [
        { label: "Applications", value: jobs.filter(j => j.applications?.length > 0).length.toString(), icon: Briefcase, color: "bg-blue-500" },
        { label: "Interviews", value: "0", icon: Users, color: "bg-purple-500" },
        { label: "Profile Score", value: student?.resume_url ? "85%" : "40%", icon: TrendingUp, color: "bg-green-500" },
        { label: "Resumes", value: student?.resume_url ? "1" : "0", icon: FileText, color: "bg-orange-500" },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                
                {/* --- HEADER SECTION START --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Welcome back, <span className="text-blue-600">{student?.name || user?.firstName}</span>! 👋
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Your {student?.branch || 'Academic'} placement journey starts here.
                        </p>
                    </motion.div>

                    {/* Edit Profile Button */}
                    <EditProfileModal student={student} />
                </div>
                {/* --- HEADER SECTION END --- */}

                {/* Main Layout Grid */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column (2/3) - Stats & Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
                                >
                                    <div className={`w-8 h-8 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                                        <stat.icon className={`w-4 h-4 ${stat.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                    <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* --- NEW: JOB FEED SECTION --- */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5" /> Recommended Drives
                                </h2>
                            </div>
                            
                            {jobs && jobs.length > 0 ? (
                                <div className="space-y-4">
                                    {jobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Briefcase className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">No Active Drives</h3>
                                    <p className="text-slate-500 mt-1">Once companies post jobs, they will appear here.</p>
                                </div>
                            )}
                        </div>

                        {/* GitHub Projects Section */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Github className="w-5 h-5" /> GitHub Projects
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {repos && repos.length > 0 ? (
                                    repos.map((repo) => (
                                        <a
                                            key={repo.id}
                                            href={repo.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 truncate pr-2">
                                                    {repo.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs bg-slate-50 px-2 py-1 rounded-md">
                                                    <Star className="w-3 h-3" /> {repo.stars}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-500 line-clamp-2 h-10 mb-3">
                                                {repo.description || "No description provided."}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs font-medium">
                                                {repo.language && (
                                                    <span className="flex items-center gap-1 text-slate-600">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        {repo.language}
                                                    </span>
                                                )}
                                                <span className="text-slate-400 flex items-center gap-1">
                                                    <GitFork className="w-3 h-3" /> Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="col-span-2 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center">
                                        <p className="text-slate-500">No public repositories found or GitHub URL missing.</p>
                                        <p className="text-xs text-slate-400 mt-1">Add your GitHub URL in settings to showcase projects.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (1/3) - Sidebar Actions */}
                    <div className="space-y-6">
                        {/* Resume Uploader */}
                        <ResumeUploader
                            studentId={student.clerk_id}
                            currentResumeUrl={student.resume_url}
                        />

                        {/* Placeholder for Upcoming Interviews/Notifications */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4">Notifications</h3>
                            <div className="text-sm text-slate-500 text-center py-4">
                                All caught up! 🎉
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}