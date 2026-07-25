import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});
type FormData = z.infer<typeof schema>;

export function ForgotPassword() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: FormData) => {
    // Mock API Call delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    console.log('Recovery request for:', data.email);
    toast.success('Reset link sent to your email! Please check your inbox.');
    
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Reset your password</h1>
        <p className="text-sm text-slate-500 mt-2">Enter your email and we'll send you a recovery link.</p>
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
        
        <Button type="submit" disabled={isSubmitting} className="mt-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white shadow-sm transition-all h-10">
          {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
        </Button>
      </form>

      <p className="text-center text-sm mt-4">
        <Link to="/" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">
          &larr; Back to sign in
        </Link>
      </p>
    </div>
  );
}
