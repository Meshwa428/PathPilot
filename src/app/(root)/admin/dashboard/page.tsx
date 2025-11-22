import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { getAdminStats, getAllUsers } from "../../../../../actions/admin.action";
import { getUserById } from "../../../../../actions/user.action";
import { Users, Briefcase, FileText, Building2, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  // Double check role (Security)
  const userProfile = await getUserById(userId);
  if (userProfile?.role !== 'admin') return redirect("/dashboard");

  const stats = await getAdminStats();
  const { students, recruiters } = await getAllUsers();

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Placement Cell Admin</h1>
        <p className="text-slate-500 mb-8">Overview of platform activity and users.</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Students" value={stats.students} icon={Users} color="bg-blue-500" />
          <StatCard label="Recruiters" value={stats.recruiters} icon={Building2} color="bg-orange-500" />
          <StatCard label="Active Jobs" value={stats.jobs} icon={Briefcase} color="bg-purple-500" />
          <StatCard label="Total Applications" value={stats.applications} icon={FileText} color="bg-green-500" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Recent Students */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Students</h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {students?.map((student: any) => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                      {student.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.branch} • CGPA: {student.cgpa}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(student.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Recruiters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Recent Recruiters</h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {recruiters?.map((recruiter: any) => (
                <div key={recruiter.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                      {recruiter.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">{recruiter.name}</p>
                      <p className="text-xs text-slate-500">{recruiter.organizations?.name || 'No Org'}</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(recruiter.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}