'use client';

import { useState } from 'react';
import { GraduationCap, Building2, CheckCircle2, Briefcase } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelect: (type: 'student' | 'recruiter' | 'admin') => void;
}

export default function UserTypeSelection({ onSelect }: UserTypeSelectionProps) {
  const [selected, setSelected] = useState<'student' | 'recruiter' | 'admin' | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">
        Welcome to PathPilot
      </h2>
      <p className="text-slate-500 text-center mb-8">
        Choose your role to set up your workspace.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* 1. Student */}
        <div 
          onClick={() => setSelected('student')}
          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
            selected === 'student' 
              ? 'border-blue-600 bg-blue-50/50' 
              : 'border-slate-200 bg-white hover:border-blue-300'
          }`}
        >
          {selected === 'student' && (
            <div className="absolute top-3 right-3 text-blue-600">
              <CheckCircle2 className="w-5 h-5 fill-blue-100" />
            </div>
          )}
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Student</h3>
          <p className="text-xs text-slate-500 mt-1">
            Build profile & apply for jobs.
          </p>
        </div>

        {/* 2. Recruiter */}
        <div 
          onClick={() => setSelected('recruiter')}
          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
            selected === 'recruiter' 
              ? 'border-orange-600 bg-orange-50/50' 
              : 'border-slate-200 bg-white hover:border-orange-300'
          }`}
        >
          {selected === 'recruiter' && (
            <div className="absolute top-3 right-3 text-orange-600">
              <CheckCircle2 className="w-5 h-5 fill-orange-100" />
            </div>
          )}
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-3 text-orange-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Recruiter</h3>
          <p className="text-xs text-slate-500 mt-1">
            Post jobs & hire talent.
          </p>
        </div>

        {/* 3. Admin */}
        <div 
          onClick={() => setSelected('admin')}
          className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-lg ${
            selected === 'admin' 
              ? 'border-purple-600 bg-purple-50/50' 
              : 'border-slate-200 bg-white hover:border-purple-300'
          }`}
        >
          {selected === 'admin' && (
            <div className="absolute top-3 right-3 text-purple-600">
              <CheckCircle2 className="w-5 h-5 fill-purple-100" />
            </div>
          )}
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-3 text-purple-600">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Placement Cell</h3>
          <p className="text-xs text-slate-500 mt-1">
            Manage drives & analytics.
          </p>
        </div>
      </div>

      <button
        disabled={!selected}
        onClick={() => selected && onSelect(selected)}
        className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
      >
        Continue as {selected ? selected.charAt(0).toUpperCase() + selected.slice(1) : '...'}
      </button>
    </div>
  );
}