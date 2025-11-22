'use client';

import { useState } from 'react';
// ✅ CHANGED: Imported IndianRupee instead of DollarSign
import { MapPin, IndianRupee, Building2, Loader2, Trash2 } from 'lucide-react';
import { applyToJob, withdrawApplication } from '../../../actions/job.action';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function JobCard({ job }: { job: any }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const application = job.applications?.[0];
  const hasApplied = !!application;
  const status = application?.status || 'applied';

  const handleApply = async () => {
    setIsLoading(true);
    try {
      await applyToJob(job.id);
    } catch (error) {
      alert("Error applying");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm("Are you sure you want to withdraw your application?")) return;
    
    setIsLoading(true);
    try {
      await withdrawApplication(job.id);
    } catch (error) {
      alert("Error withdrawing");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'shortlisted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'selected': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-lg">
            {job.organizations?.name[0] || <Building2 className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {job.organizations?.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {hasApplied ? (
            <>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
                {status}
              </span>
              
              {status === 'applied' || status === 'shortlisted' ? (
                <button 
                  onClick={handleWithdraw}
                  disabled={isLoading}
                  className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 hover:underline"
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                  Withdraw
                </button>
              ) : null}
            </>
          ) : (
            <button 
              onClick={handleApply}
              disabled={isLoading}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Now'}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-4 text-sm text-slate-500">
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
          <MapPin className="w-3 h-3" /> {job.location}
        </div>
        <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md">
          {/* ✅ CHANGED: Uses IndianRupee Icon */}
          <IndianRupee className="w-3 h-3" /> {job.salary_range}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.requirements?.map((skill: string, i: number) => (
          <span key={i} className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border border-slate-200 px-2 py-1 rounded-md">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}