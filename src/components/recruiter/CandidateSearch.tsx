'use client';

import { useState } from 'react';
import { Search, Loader2, UserCheck, AlertCircle, Sparkles, Layers } from 'lucide-react';
// Make sure this path is correct relative to your components folder
import { searchCandidates, sendDirectOffer } from '../../../actions/recruiter.action';

export default function CandidateSearch() {
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offeringId, setOfferingId] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setResults([]);
    setHasSearched(false);
    setIsLoading(true);

    try {
      const data = await searchCandidates(query);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  };

  const handleOffer = async (studentId: string) => {
    setOfferingId(studentId);
    try {
        await sendDirectOffer(studentId, "We were impressed by your profile and would like to interview you directly.");
        alert("Offer sent successfully!");
    } catch (error) {
        alert("Failed to send offer.");
    } finally {
        setOfferingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your ideal candidate (e.g. 'Python expert with 8.5 CGPA')..."
          className="block w-full pl-11 pr-32 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-slate-900 placeholder:text-slate-400 transition-all"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 bottom-2 bg-slate-900 text-white px-6 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-70 flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
      </form>

      {/* Results Status */}
      {hasSearched && results.length > 0 && (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 px-2">
          {results[0]._isFallback ? (
             <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                <Layers className="w-3 h-3" /> Filtered by Skills (Keyword Match)
             </span>
          ) : (
             <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3" /> AI Semantic Match
             </span>
          )}
          <span>Found {results.length} candidates</span>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {results.map((student: any) => (
          <div key={student.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-200 transition-all shadow-sm hover:shadow-md group">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                        {student.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight">{student.name}</h3>
                        <p className="text-sm text-slate-500">{student.branch} • CGPA: {student.cgpa}</p>
                    </div>
                </div>
                {student.resume_url && (
                    <a href={student.resume_url} target="_blank" className="text-xs font-bold text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded-lg">
                        Resume
                    </a>
                )}
            </div>
            
            {/* Summary Snippet */}
            {student.profile_summary ? (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 leading-relaxed border border-slate-100">
                    "{student.profile_summary.substring(0, 140)}..."
                </div>
            ) : (
                <div className="mt-4 text-xs text-slate-400 italic">No AI summary available.</div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex gap-2 overflow-hidden">
                    {student.skills?.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">
                            {skill}
                        </span>
                    ))}
                </div>
                <button 
                    onClick={() => handleOffer(student.id)}
                    disabled={!!offeringId}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                    {offeringId === student.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserCheck className="w-3 h-3" />}
                    Appoint
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* No Results State */}
      {hasSearched && results.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 font-medium">No candidates found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your search terms or keywords.</p>
        </div>
      )}
    </div>
  );
}