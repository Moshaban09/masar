import { Link } from 'react-router-dom';
import { Hexagon, ArrowRight, CheckCircle2, KanbanSquare, CalendarDays, Users2, LineChart, LayoutDashboard } from 'lucide-react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../store/useAuth';

export function Home() {
  const activeSection = useScrollSpy(['features', 'testimonials', 'pricing']);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[var(--primary)] selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xl tracking-tight">
            <img src="/favicon.svg" alt="Masar Logo" className="w-7 h-7" />
            Masar
          </div>
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600">
            <a href="#features" className={`px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'features' ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-bold' : 'hover:text-slate-900 hover:bg-slate-100/60'}`}>Features</a>
            <a href="#testimonials" className={`px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'testimonials' ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-bold' : 'hover:text-slate-900 hover:bg-slate-100/60'}`}>Testimonials</a>
            <a href="#pricing" className={`px-4 py-2 rounded-full transition-all duration-200 ${activeSection === 'pricing' ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-bold' : 'hover:text-slate-900 hover:bg-slate-100/60'}`}>Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 text-sm font-medium flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-sm font-medium">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 text-sm font-medium">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[1000px] h-[500px] bg-[var(--primary)]/20 blur-[120px] rounded-full pointer-events-none opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-sm font-medium text-slate-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-[var(--primary)]"></span>
            Introducing Masar 2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Manage your projects with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-blue-600">unparalleled clarity.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Masar keeps your team aligned, focused, and shipping faster than ever before. It's the developer-first workspace you always wanted.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-8 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 text-base shadow-lg shadow-[var(--primary)]/25">
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button size="lg" className="h-12 px-8 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 text-base shadow-lg shadow-[var(--primary)]/25">
                    Get Started for Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-white">
                    Book a Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Hero Image Mockup */}
        <div className="container mx-auto px-4 mt-20 max-w-6xl relative z-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-2 shadow-2xl">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative">
               <img 
                 src="/dashboard-preview.png" 
                 alt="Masar Dashboard Preview" 
                 className="w-full h-auto block"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50 scroll-mt-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to ship</h2>
            <p className="text-lg text-slate-500">Replace your disjointed toolchain with a single, unified workspace designed for modern product teams.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: KanbanSquare, title: 'Visual Kanban Boards', desc: 'Organize tasks intuitively with drag-and-drop boards that keep everyone in sync.' },
              { icon: LineChart, title: 'Interactive Dashboard', desc: 'Monitor project health with real-time charts and progress metrics at a glance.' },
              { icon: Users2, title: 'Team Management', desc: 'Invite members, assign roles, and manage your team capacity effectively.' },
              { icon: CalendarDays, title: 'Calendar View', desc: 'Visualize task deadlines and project milestones across a clean monthly calendar.' },
              { icon: CheckCircle2, title: 'Deep Task Details', desc: 'Break down complex tasks into subtasks, add descriptions, and track comments.' },
              { icon: Hexagon, title: 'Real-time Notifications', desc: 'Stay updated on project changes, mentions, and approaching deadlines instantly.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white scroll-mt-16 overflow-hidden">
        <div className="container mx-auto px-4 max-w-7xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Loved by product teams</h2>
        </div>
        
        <div className="relative w-full flex overflow-hidden group py-4">
          {/* Gradient Masks */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-40 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-40 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-marquee gap-8 pl-8 w-max">
            {[
              { quote: "Masar completely transformed how our engineering team operates. We went from chaotic Slack threads to shipping features 2x faster.", author: "Sarah Jenkins", role: "VP of Product", company: "TechFlow", rating: 5 },
              { quote: "The keyboard shortcuts and instant UI speed are mind-blowing. It feels like Linear, but tailored perfectly for our workflow.", author: "Mike Chen", role: "Engineering Lead", company: "ScaleUp", rating: 5 },
              { quote: "Our designers and developers finally agree on a single tool. Really clean Kanban boards, though I'd love more custom themes.", author: "Elena Rodriguez", role: "Design Director", company: "PixelCraft", rating: 4 },
              { quote: "Tracking sprint deadlines on the Calendar view stopped our project delays. Very solid tool for fast-moving startups.", author: "David Kim", role: "CTO", company: "Vanguard", rating: 5 },
              { quote: "The smoothest DND Kanban experience I've used on the web. A few minor polish items needed, but overall fantastic.", author: "Alex Mercer", role: "Senior Frontend Engineer", company: "DevPulse", rating: 4 },
              { quote: "Having subtasks and checklists inside task modals saved us hours of status updates every single week.", author: "Jessica Foster", role: "Lead Product Manager", company: "CloudScale", rating: 5 },
              { quote: "The dashboard analytics gave our executive team instant clarity on team bandwidth and project health.", author: "Omar Hassan", role: "Head of Operations", company: "Nexus", rating: 5 },
              { quote: "Super intuitive onboarding. Our team of 25 was productive within 20 minutes. Eagerly waiting for mobile app!", author: "Lisa Wang", role: "Growth Director", company: "HyperLaunch", rating: 4 },
              // Duplicate array for seamless infinite marquee loop
              { quote: "Masar completely transformed how our engineering team operates. We went from chaotic Slack threads to shipping features 2x faster.", author: "Sarah Jenkins", role: "VP of Product", company: "TechFlow", rating: 5 },
              { quote: "The keyboard shortcuts and instant UI speed are mind-blowing. It feels like Linear, but tailored perfectly for our workflow.", author: "Mike Chen", role: "Engineering Lead", company: "ScaleUp", rating: 5 },
              { quote: "Our designers and developers finally agree on a single tool. Really clean Kanban boards, though I'd love more custom themes.", author: "Elena Rodriguez", role: "Design Director", company: "PixelCraft", rating: 4 },
              { quote: "Tracking sprint deadlines on the Calendar view stopped our project delays. Very solid tool for fast-moving startups.", author: "David Kim", role: "CTO", company: "Vanguard", rating: 5 },
              { quote: "The smoothest DND Kanban experience I've used on the web. A few minor polish items needed, but overall fantastic.", author: "Alex Mercer", role: "Senior Frontend Engineer", company: "DevPulse", rating: 4 },
              { quote: "Having subtasks and checklists inside task modals saved us hours of status updates every single week.", author: "Jessica Foster", role: "Lead Product Manager", company: "CloudScale", rating: 5 },
              { quote: "The dashboard analytics gave our executive team instant clarity on team bandwidth and project health.", author: "Omar Hassan", role: "Head of Operations", company: "Nexus", rating: 5 },
              { quote: "Super intuitive onboarding. Our team of 25 was productive within 20 minutes. Eagerly waiting for mobile app!", author: "Lisa Wang", role: "Growth Director", company: "HyperLaunch", rating: 4 }
            ].map((testimonial, i) => (
              <div key={i} className="w-[350px] md:w-[420px] p-8 rounded-2xl bg-white border border-slate-200/80 flex-shrink-0 flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[var(--primary)]/10 hover:border-[var(--primary)]/30 duration-300">
                <div className="flex-1 flex flex-col justify-start">
                  <div className="flex text-amber-400 mb-5 gap-1">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className={`w-5 h-5 ${j < testimonial.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-base md:text-lg font-normal leading-relaxed italic">"{testimonial.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-sm border border-[var(--primary)]/20">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{testimonial.author}</p>
                    <p className="text-xs text-slate-500 font-medium">{testimonial.role} <span className="text-slate-300">•</span> <span className="text-[var(--primary)] font-semibold">{testimonial.company}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-900 text-white scroll-mt-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-400">Start for free, upgrade when your team grows.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
              <h3 className="text-2xl font-semibold mb-2">Starter</h3>
              <p className="text-slate-400 mb-6">Perfect for small teams and startups.</p>
              <div className="text-4xl font-bold mb-8">$0<span className="text-lg text-slate-400 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[var(--primary)]" /> Up to 5 team members</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[var(--primary)]" /> Unlimited tasks & projects</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[var(--primary)]" /> Basic analytics</li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 h-12 text-base">Get Started</Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-[var(--primary)] to-blue-700 rounded-3xl p-8 border border-[var(--primary)] relative shadow-2xl shadow-[var(--primary)]/20">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-amber-400 text-amber-950 text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</div>
              <h3 className="text-2xl font-semibold mb-2">Professional</h3>
              <p className="text-blue-100 mb-6">For growing teams that need more power.</p>
              <div className="text-4xl font-bold mb-8">$12<span className="text-lg text-blue-200 font-normal">/user/mo</span></div>
              <ul className="space-y-4 mb-8 text-blue-50">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Unlimited team members</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> Advanced custom workflows</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-200" /> API access & integrations</li>
              </ul>
              <Link to="/signup">
                <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 h-12 text-base border-0">Start 14-day trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-lg">
            <img src="/favicon.svg" alt="Masar Logo" className="w-6 h-6" />
            Masar
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Masar Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
