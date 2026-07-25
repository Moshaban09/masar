import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { User, Shield, CreditCard } from 'lucide-react';
import { useAuth } from '../../store/useAuth';
import { toast } from 'sonner';

export function Settings() {
  const { user, updateProfile, updateAvatar, updatePassword, upgradePlan, cancelSubscription } = useAuth();
  
  // Profile State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSaveProfile = () => {
    updateProfile(name, email);
    toast.success('Profile updated successfully');
  };

  const handleChangeAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newAvatar = `https://i.pravatar.cc/150?u=${randomId}`;
    updateAvatar(newAvatar);
    toast.success('Avatar updated successfully');
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) {
      toast.error('Please fill in both fields');
      return;
    }
    setIsUpdatingPassword(true);
    const success = await updatePassword(oldPassword, newPassword);
    setIsUpdatingPassword(false);
    
    if (success) {
      toast.success('Password updated successfully');
      setOldPassword('');
      setNewPassword('');
    } else {
      toast.error('Incorrect current password');
    }
  };
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto w-full pb-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <Tabs defaultValue="profile" className="w-full">
          <div className="border-b border-slate-200 px-4 sm:px-6 py-4 sm:pt-4 sm:pb-0 bg-slate-50/50">
            <TabsList className="bg-transparent !h-auto p-0 flex flex-col sm:flex-row w-full gap-2 sm:gap-6 justify-start">
              <TabsTrigger 
                value="profile" 
                className="w-full sm:w-auto sm:flex-none justify-start sm:justify-center data-[state=active]:bg-white sm:data-[state=active]:bg-transparent data-[state=active]:shadow-sm sm:data-[state=active]:shadow-none data-[state=active]:text-[var(--primary)] sm:data-[state=active]:text-slate-900 outline-none focus:outline-none focus:ring-0 rounded-lg sm:rounded-none px-3 sm:px-2 py-2.5 sm:py-0 sm:pb-3 text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-100 sm:hover:bg-transparent transition-colors text-sm border sm:border-0 border-transparent data-[state=active]:border-slate-200 sm:data-[state=active]:border-transparent sm:border-b-2 sm:data-[state=active]:border-b-[var(--primary)]"
              >
                <User className="w-4 h-4 mr-1.5 sm:mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="w-full sm:w-auto sm:flex-none justify-start sm:justify-center data-[state=active]:bg-white sm:data-[state=active]:bg-transparent data-[state=active]:shadow-sm sm:data-[state=active]:shadow-none data-[state=active]:text-[var(--primary)] sm:data-[state=active]:text-slate-900 outline-none focus:outline-none focus:ring-0 rounded-lg sm:rounded-none px-3 sm:px-2 py-2.5 sm:py-0 sm:pb-3 text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-100 sm:hover:bg-transparent transition-colors text-sm border sm:border-0 border-transparent data-[state=active]:border-slate-200 sm:data-[state=active]:border-transparent sm:border-b-2 sm:data-[state=active]:border-b-[var(--primary)]"
              >
                <Shield className="w-4 h-4 mr-1.5 sm:mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="billing" 
                className="w-full sm:w-auto sm:flex-none justify-start sm:justify-center data-[state=active]:bg-white sm:data-[state=active]:bg-transparent data-[state=active]:shadow-sm sm:data-[state=active]:shadow-none data-[state=active]:text-[var(--primary)] sm:data-[state=active]:text-slate-900 outline-none focus:outline-none focus:ring-0 rounded-lg sm:rounded-none px-3 sm:px-2 py-2.5 sm:py-0 sm:pb-3 text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-100 sm:hover:bg-transparent transition-colors text-sm border sm:border-0 border-transparent data-[state=active]:border-slate-200 sm:data-[state=active]:border-transparent sm:border-b-2 sm:data-[state=active]:border-b-[var(--primary)]"
              >
                <CreditCard className="w-4 h-4 mr-1.5 sm:mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            <TabsContent value="profile" className="mt-0 outline-none">
              <div className="max-w-xl flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <img src={user?.avatar} alt="Avatar" className="w-20 h-20 rounded-full border border-slate-200 object-cover" />
                  <Button variant="outline" onClick={handleChangeAvatar}>Change Avatar</Button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                
                <Button className="w-max bg-[var(--primary)] text-white hover:opacity-90" onClick={handleSaveProfile}>Save Changes</Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0 outline-none">
              <div className="max-w-xl flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">Current Password</label>
                  <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="••••••••" className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="h-10 rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]" />
                </div>
                
                <Button className="w-max bg-slate-900 text-white hover:bg-slate-800" disabled={isUpdatingPassword} onClick={handleUpdatePassword}>
                  {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="billing" className="mt-0 outline-none">
               <div className="flex flex-col gap-6">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 capitalize">{user?.plan} Plan</h4>
                      {user?.plan === 'pro' ? (
                        <p className="text-sm text-slate-500">$29/month. Next charge on Aug 1st.</p>
                      ) : (
                        <p className="text-sm text-slate-500">Free forever. Upgrade for more features.</p>
                      )}
                    </div>
                    {user?.plan === 'pro' && (
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
                    )}
                  </div>
                  
                  {user?.plan === 'pro' ? (
                    <Button 
                      variant="outline" 
                      className="w-max text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => {
                        cancelSubscription();
                        toast.success('Subscription cancelled. You are now on the Free Plan.');
                      }}
                    >
                      Cancel Subscription
                    </Button>
                  ) : (
                    <Button 
                      className="w-max bg-[var(--primary)] text-white hover:opacity-90"
                      onClick={() => {
                        upgradePlan();
                        toast.success('Successfully upgraded to Pro!');
                      }}
                    >
                      Upgrade to Pro
                    </Button>
                  )}
               </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
