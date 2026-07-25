import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { User, Shield, CreditCard } from 'lucide-react';

export function Settings() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-slate-200 px-6 pt-4 bg-slate-50/50">
            <TabsList className="bg-transparent h-auto p-0 flex gap-6">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)] data-[state=active]:text-[var(--primary)] rounded-none px-0 pb-3 text-slate-500 font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)] data-[state=active]:text-[var(--primary)] rounded-none px-0 pb-3 text-slate-500 font-medium"
              >
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[var(--primary)] data-[state=active]:text-[var(--primary)] rounded-none px-0 pb-3 text-slate-500 font-medium"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="profile" className="mt-0 outline-none">
              <div className="max-w-xl flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <img src="https://i.pravatar.cc/150?u=current" alt="Avatar" className="w-20 h-20 rounded-full border border-slate-200 object-cover" />
                  <Button variant="outline">Change Avatar</Button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" defaultValue="Amir" className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" defaultValue="amir@masar.io" className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                
                <Button className="w-max bg-[var(--primary)] text-white hover:opacity-90">Save Changes</Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
              <div className="max-w-xl flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <input type="password" placeholder="••••••••" className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">New Password</label>
                  <input type="password" placeholder="••••••••" className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                
                <Button className="w-max bg-slate-900 text-white hover:bg-slate-800">Update Password</Button>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-0 outline-none">
               <div className="flex flex-col gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900">Pro Plan</h4>
                      <p className="text-sm text-slate-500">$29/month. Next charge on Aug 1st.</p>
                    </div>
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-max text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                    Cancel Subscription
                  </Button>
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
