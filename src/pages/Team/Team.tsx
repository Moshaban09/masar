import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { Button } from '../../components/ui/button';
import { Plus, Mail, Trash2 } from 'lucide-react';
import { InviteMemberModal } from './InviteMemberModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';

export function Team() {
  const { members, removeMember } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'away': return 'bg-amber-500';
      case 'offline': return 'bg-slate-300';
      default: return 'bg-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Team Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your team members and their roles.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-[var(--primary)] text-white shadow-sm hover:opacity-90">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {members.map(member => (
          <div key={member.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img src={member.avatar} alt={member.name} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
              <div className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
            </div>
            
            <h3 className="font-semibold text-slate-900 truncate w-full">{member.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{member.role}</p>
            
            <div className="w-full grid grid-cols-2 gap-2 mt-auto border-t border-slate-100 pt-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Tasks</span>
                <span className="font-medium text-slate-700">{member.activeTasks}</span>
              </div>
              <div className="flex flex-col items-center border-l border-slate-100">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Capacity</span>
                <span className="font-medium text-slate-700">{Math.round((member.activeTasks / member.capacity) * 100)}%</span>
              </div>
            </div>
            
            <div className="w-full mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                <Mail className="w-3 h-3 mr-1.5" />
                Email
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-8 h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 border-slate-200 hover:border-red-200 shrink-0"
                onClick={() => setMemberToDelete(member.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <InviteMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <Dialog open={!!memberToDelete} onOpenChange={(open) => !open && setMemberToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Remove Team Member
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the workspace? They will lose access to all projects and tasks.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setMemberToDelete(null)}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white" 
              onClick={() => {
                if (memberToDelete) {
                  removeMember(memberToDelete);
                  setMemberToDelete(null);
                }
              }}
            >
              Remove Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
