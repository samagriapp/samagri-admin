import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label ? (
        <label className="mb-1.5 block text-sm font-medium text-slate-700" htmlFor={props.id ?? props.name}>
          {label}
        </label>
      ) : null}
      <input
        ref={ref}
        className={clsx(
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10',
          error && 'border-red-300 focus:border-red-400 focus:ring-red-100',
          className,
        )}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
});
