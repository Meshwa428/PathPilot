'use client';

import { Check, X, Bell } from 'lucide-react';
import { respondToOffer } from '../../../actions/student-notification.action';
import { useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function NotificationList({ notifications }: { notifications: any[] }) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleResponse = async (id: number, accept: boolean) => {
    setLoadingId(id);
    await respondToOffer(id, accept);
    setLoadingId(null);
  };

  if (notifications.length === 0) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                <Bell className="w-5 h-5" />
            </div>
            <p className="text-sm text-slate-500">No new notifications.</p>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Bell className="w-4 h-4 text-orange-500" /> Notifications
      </h3>
      
      <div className="space-y-4">
        {notifications.map((notif) => (
          <div key={notif.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-slate-900">{notif.org_name}</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    notif.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    notif.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                    {notif.status}
                </span>
            </div>
            <p className="text-xs text-slate-600 mb-3">{notif.message}</p>
            
            {notif.status === 'unread' && (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleResponse(notif.id, true)}
                        disabled={!!loadingId}
                        className="flex-1 bg-green-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                    >
                        <Check className="w-3 h-3" /> Accept
                    </button>
                    <button 
                        onClick={() => handleResponse(notif.id, false)}
                        disabled={!!loadingId}
                        className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-1"
                    >
                        <X className="w-3 h-3" /> Decline
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}