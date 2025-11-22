export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-purple-600"></div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Setting up profile...
        </p>
      </div>
    </div>
  );
}