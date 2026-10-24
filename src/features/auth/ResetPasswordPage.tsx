import { zodResolver } from '@hookform/resolvers/zod';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { authApi } from '../../services/authApi';

const resetPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  code: z.string().min(4, 'Recovery code is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsLoading(true);
    try {
      await authApi.resetPassword({
        email: values.email,
        code: values.code,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });
      setSuccess(true);
      toast.success('Password reset was successful.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white">S</div>
          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-400">SamagriApp</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">Reset your password</h1>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600">Your password has been reset successfully.</p>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700">
              <ShieldCheck className="h-4 w-4" />
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" error={form.formState.errors.email?.message} {...form.register('email')} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="code" className="text-sm font-medium text-slate-700">Recovery code</label>
                <Input id="code" placeholder="Enter code from email" error={form.formState.errors.code?.message} {...form.register('code')} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">New password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type="password" autoComplete="new-password" className="pl-10" error={form.formState.errors.password?.message} {...form.register('password')} />
                </div>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-700">Confirm new password</label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="confirmPassword" type="password" autoComplete="new-password" className="pl-10" error={form.formState.errors.confirmPassword?.message} {...form.register('confirmPassword')} />
                </div>
              </div>
            </div>

            <Button type="submit" loading={isLoading} className="w-full">Reset password</Button>
          </form>
        )}
      </div>
    </div>
  );
}
