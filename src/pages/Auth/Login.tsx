import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../store/useAuth';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'ava@masar.io',
      password: 'password',
    },
  });

  const handleOAuthClick = (provider: string) => {
    toast.warning(`${provider} login will be enabled in a future release.`);
  };

  const onSubmit = async (data: FormData) => {
    const success = await login(data.email, data.password);
    if (success) {
      toast.success('Welcome back to Masar');
      navigate('/dashboard');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-2">Enter your credentials to access your workspace.</p>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" type="button" className="w-full text-slate-600 hover:text-slate-900 font-normal border-slate-200" onClick={() => handleOAuthClick('Google')}>
          Google
        </Button>
        <Button variant="outline" type="button" className="w-full text-slate-600 hover:text-slate-900 font-normal border-slate-200" onClick={() => handleOAuthClick('GitHub')}>
          GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">Or continue with</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={`h-10 rounded-md border ${errors.email ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs text-[var(--primary)] hover:underline font-medium">Forgot?</Link>
          </div>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`h-10 rounded-md border ${errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="mt-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white shadow-sm transition-all h-10">
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-[var(--primary)] font-medium hover:underline">
          Start free trial
        </Link>
      </p>
    </div>
  );
}
