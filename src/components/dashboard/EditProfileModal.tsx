'use client';

import { useState } from 'react';
import { Settings, X, Save, Github, Linkedin, Cpu } from 'lucide-react';
import { updateStudentProfile } from '../../../actions/user.action';

export default function EditProfileModal({ student }: { student: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    try {
      await updateStudentProfile(formData);
      setIsOpen(false);
    } catch (error) {
      alert("Failed to update");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* The Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Edit Profile
      </button>

      {/* The Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Edit Profile</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form action={handleSave} className="p-6 space-y-5">
              
              {/* GitHub */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">GitHub URL</label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    name="githubUrl" 
                    defaultValue={student.github_url || ''}
                    placeholder="https://github.com/username"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Used to fetch your projects automatically.</p>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    name="linkedinUrl" 
                    defaultValue={student.linkedin_url || ''}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Skills</label>
                <div className="relative">
                  <Cpu className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input 
                    name="skills" 
                    defaultValue={student.skills?.join(', ') || ''}
                    placeholder="React, Node.js, Python"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
}