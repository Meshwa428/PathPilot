'use client';

import { useState } from 'react';
import { Check, X, Clock, Loader2, ChevronDown } from 'lucide-react';
import { updateApplicationStatus } from '../../../actions/job.action';
import { useRouter } from 'next/navigation';

const STATUS_CONFIG = {
  'applied': { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: Clock, label: 'Applied' },
  'shortlisted': { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Check, label: 'Shortlisted' },
  'selected': { color: 'bg-green-100 text-green-700 border-green-200', icon: Check, label: 'Selected' },
  'rejected': { color: 'bg-red-50 text-red-600 border-red-200', icon: X, label: 'Rejected' },
};

export default function ApplicantStatusBadge({ status, applicationId }: { status: string, applicationId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const currentStatus = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG['applied'];

  const handleUpdate = async (newStatus: string) => {
    setIsLoading(true);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setIsOpen(false);
      router.refresh(); // Refresh to show updated state
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${currentStatus.color}`}
      >
        {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <currentStatus.icon className="w-3 h-3" />}
        {currentStatus.label}
        <ChevronDown className="w-3 h-3 opacity-50 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => handleUpdate(key)}
              className="w-full text-left px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${config.color.split(' ')[0].replace('bg-', 'bg-')}`} />
              {config.label}
            </button>
          ))}
        </div>
      )}
      
      {/* Click outside to close backdrop */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}