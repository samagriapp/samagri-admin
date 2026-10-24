import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            </div>
          </div>
          <button type="button" onClick={onCancel} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close dialog">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" disabled={loading} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-70" onClick={onConfirm}>
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
