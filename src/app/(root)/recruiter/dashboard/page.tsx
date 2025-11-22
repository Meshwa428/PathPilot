import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import CreateJobModal from "@/components/recruiter/CreateJobModal";
import { getRecruiterJobs } from "../../../../../actions/job.action";
// ✅ CHANGED: Imported IndianRupee
import { Users, Calendar, ChevronRight, MapPin, IndianRupee, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function RecruiterDashboard() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // Fetch jobs server-side
  const jobs = await getRecruiterJobs();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Recruiter Dashboard</h1>
            <p className="text-slate-500 mt-1">Manage your recruitment drives and track applicants.</p>
          </div>
          <CreateJobModal />
        </div>

        {/* Job Grid */}
        {jobs.length > 0 ? (
          <div className="grid gap-6">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-12 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-5">Role & Details</div>
              <div className="col-span-2">Applicants</div>
              <div className="col-span-2">Posted</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1"></div>
            </div>

            {/* Job Cards */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {jobs.map((job: any) => {
              // Calculate Applicant Count
              const applicantCount = job.applications?.[0]?.count || 0;

              return (
                <Link 
                  href={`/recruiter/jobs/${job.id}`} 
                  key={job.id} 
                  className="bg-white border border-slate-200 rounded-xl p-6 grid md:grid-cols-12 gap-4 md:gap-0 items-center hover:shadow-md transition-all group cursor-pointer block"
                >
                  
                  {/* Role Info */}
                  <div className="col-span-12 md:col-span-5">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                      {/* ✅ CHANGED: Uses IndianRupee Icon */}
                      <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> {job.salary_range}</span>
                    </div>
                  </div>

                  {/* Applicant Count */}
                  <div className="col-span-6 md:col-span-2 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {applicantCount > 0 ? (
                        <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                          {applicantCount}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">0</div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {applicantCount} Applied
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-6 md:col-span-2 text-sm text-slate-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(job.created_at).toLocaleDateString('en-GB')}
                  </div>

                  {/* Status Badge */}
                  <div className="col-span-6 md:col-span-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Action Arrow */}
                  <div className="col-span-6 md:col-span-1 flex justify-end text-slate-300 group-hover:text-orange-600">
                    <ChevronRight className="w-6 h-6" />
                  </div>

                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Drives Posted</h3>
            <p className="text-slate-500 mt-1 mb-6">Create your first job listing to start receiving applications.</p>
            <CreateJobModal />
          </div>
        )}

      </div>
    </div>
  );
}