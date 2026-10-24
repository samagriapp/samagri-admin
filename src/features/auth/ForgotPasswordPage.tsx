import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { authApi } from '../../services/authApi';

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);

    try {
      await authApi.requestPasswordReset({ email: values.email });
      setSubmitted(true);
      toast.success('If that account exists, a reset link has been sent.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to send reset request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white">S</div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">SamagriApp</p>
            <h1 className="text-2xl font-semibold text-slate-900">Forgot your password?</h1>
          </div>
        </div>

        {submitted ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-600">If that email is registered, a recovery link or code will be sent shortly.</p>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <p className="text-sm text-slate-600">Enter the email address connected to your admin account.</p>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-10" error={form.formState.errors.email?.message} {...form.register('email')} />
              </div>
            </div>

            <Button type="submit" loading={isLoading} className="w-full">Send recovery link</Button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
