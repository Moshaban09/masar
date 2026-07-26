import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../store/useAuth';
import { useWorkspace } from '../../store/useWorkspace';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  workspace: z.string().min(3, 'Workspace name must be at least 3 characters'),
});
type FormData = z.infer<typeof schema>;

export function Signup() {
  const { login } = useAuth();
  const { clearWorkspace } = useWorkspace();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', workspace: '' },
  });

  const onSubmit = async (data: FormData) => {
    // Mock Signup delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log('Signup data:', data);
    
    // Auto-login the user with the new credentials
    const success = await login(data.email, data.password, data.name);
    
    if (success) {
      clearWorkspace();
      toast.success('Account created successfully! Welcome to Masar.');
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
        <p className="text-sm text-slate-500 mt-2">Start managing your projects with clarity today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`h-10 rounded-md border ${errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="Your name"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

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
          <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className={`h-10 rounded-md border ${errors.password ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="Min 6 characters"
          />
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="workspace" className="text-sm font-medium text-slate-700">Workspace Name</label>
          <input
            id="workspace"
            type="text"
            {...register('workspace')}
            className={`h-10 rounded-md border ${errors.workspace ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]'} bg-white px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all`}
            placeholder="e.g. Acme Corp"
          />
          {errors.workspace && <p className="text-xs text-red-500">{errors.workspace.message}</p>}
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="mt-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white shadow-sm transition-all h-10">
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--primary)] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
