import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { getJobApplicants } from "../../../../../../actions/job.action";
import { ArrowLeft, FileText, Github, Download } from "lucide-react";
import Link from "next/link";
import ApplicantStatusBadge from "@/components/recruiter/ApplicantStatusBadge";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function JobDetailsPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const applicants = await getJobApplicants(jobId);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Back Header */}
        <div className="mb-8">
          <Link href="/recruiter/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Applicant Management</h1>
              <p className="text-slate-500 mt-1">Reviewing {applicants.length} candidates for this drive.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* --- APPLICANTS LIST (Replaces Table) --- */}
        <div className="space-y-4">
          
          {/* Header Row (Visible on Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Candidate</div>
            <div className="col-span-3">Academic Profile</div>
            <div className="col-span-3">Skills & Resume</div>
            <div className="col-span-2 text-right">Status</div>
          </div>

          {applicants.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            applicants.map((app: any) => (
              <div 
                key={app.id} 
                className="bg-white border border-slate-200 rounded-xl p-6 grid md:grid-cols-12 gap-6 md:gap-4 items-center shadow-sm hover:shadow-md transition-all"
              >
                
                {/* 1. Candidate Info */}
                <div className="col-span-12 md:col-span-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {app.students?.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{app.students?.name}</h3>
                    <p className="text-sm text-slate-500">{app.students?.email}</p>
                    {app.students?.github_url && (
                      <a href={app.students.github_url} target="_blank" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                        <Github className="w-3 h-3" /> GitHub Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* 2. Academic Info */}
                <div className="col-span-12 md:col-span-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-slate-700">{app.students?.branch}</span>
                    <span className="text-sm text-slate-500">CGPA: <span className="text-slate-900 font-medium">{app.students?.cgpa}</span></span>
                    <span className="text-xs text-slate-400">ID: {app.students?.college_id}</span>
                  </div>
                </div>

                {/* 3. Skills & Resume */}
                <div className="col-span-12 md:col-span-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {app.students?.skills?.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 text-[10px] font-bold rounded border border-slate-200 uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {app.students?.resume_url ? (
                    <a 
                      href={app.students.resume_url} 
                      target="_blank" 
                      className="inline-flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700"
                    >
                      <FileText className="w-3 h-3" /> View Resume PDF
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No Resume</span>
                  )}
                </div>

                {/* 4. Status Dropdown (No longer clipped!) */}
                <div className="col-span-12 md:col-span-2 flex md:justify-end relative">
                   {/* Pass custom class to ensure it aligns right on desktop */}
                   <ApplicantStatusBadge status={app.status} applicationId={app.id} />
                </div>

              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <p className="text-slate-500">No students have applied to this drive yet.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}