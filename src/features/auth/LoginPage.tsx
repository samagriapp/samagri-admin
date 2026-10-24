import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/authApi';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional(),
});

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const from = (location.state as { from?: string } | null)?.from || '/dashboard';

  if (user) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setSubmitting(true);

    try {
      const result = await authApi.login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      login(result.user, result.token);
      toast.success('Signed in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-soft">
        <div className="mb-8 flex items-center justify-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white">S</div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">SamagriApp</p>
            <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-10" error={form.formState.errors.email?.message} {...form.register('email')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" className="pl-10 pr-10" error={form.formState.errors.password?.message} {...form.register('password')} />
              <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 text-slate-600">
              <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" {...form.register('rememberMe')} />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-700">Forgot Password?</Link>
          </div>

          <Button type="submit" loading={submitting} className="w-full" icon={<ShieldCheck className="h-4 w-4" />}>
            {submitting ? 'Signing in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
