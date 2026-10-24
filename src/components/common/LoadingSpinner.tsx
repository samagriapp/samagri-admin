export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 text-slate-500">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
