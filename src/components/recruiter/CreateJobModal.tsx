'use client';

import { useState } from 'react';
// ✅ CHANGED: Imported IndianRupee
import { Plus, X, Briefcase, MapPin, IndianRupee, Layers } from 'lucide-react';
import { createJob } from '../../../actions/job.action';

export default function CreateJobModal() {
  // ... (Logic remains same)
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await createJob(formData);
      setIsOpen(false);
    } catch (error) {
      alert("Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all">
        <Plus className="w-5 h-5" /> Post New Drive
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* ... Header ... */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Create Recruitment Drive</h2>
                    <p className="text-sm text-slate-500">Post a new opportunity for students.</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                </button>
            </div>

            <form action={handleSubmit} className="p-8 space-y-6">
              {/* ... Other Inputs ... */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input required name="title" placeholder="e.g. Software Engineer Intern" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Job Type</label>
                  <select name="type" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                    <option value="Internship">Internship</option>
                    <option value="FullTime">Full Time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input required name="location" placeholder="e.g. Bangalore / Remote" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Salary / Stipend</label>
                  <div className="relative">
                    {/* ✅ CHANGED: Uses IndianRupee Icon */}
                    <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input required name="salary" placeholder="e.g. 25k/month or 8 LPA" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Description</label>
                <textarea required name="description" rows={4} placeholder="Describe the role and responsibilities..." className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Requirements (Skills)</label>
                <div className="relative">
                  <Layers className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input required name="requirements" placeholder="React, Node.js, Python (Comma separated)" className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-600/20 disabled:opacity-70">
                  {isLoading ? 'Posting...' : 'Publish Drive'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}