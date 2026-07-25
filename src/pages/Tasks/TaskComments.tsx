import { useState } from 'react';
import { useWorkspace } from '../../store/useWorkspace';
import { useAuth } from '../../store/useAuth';
import { MessageSquare, Pencil, Trash2, Send } from 'lucide-react';
import { formatRelativeTime } from '../../utils/dateUtils';

interface Props {
  taskId: string;
}

export function TaskComments({ taskId }: Props) {
  const { tasks, addTaskComment, deleteTaskComment, updateTaskComment } = useWorkspace();
  const { user } = useAuth();
  const task = tasks.find(t => t.id === taskId);
  
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentBody, setEditCommentBody] = useState('');

  if (!task) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addTaskComment(taskId, user?.name || 'User', user?.avatar || '', newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="w-full md:w-[280px] bg-slate-50 border-l border-slate-200 flex flex-col shrink-0">
      <div className="p-4 border-b border-slate-200 bg-white shrink-0">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
          Comments
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {task.comments?.length > 0 ? (
          task.comments.map(c => (
            <div key={c.id} className="flex gap-3 group animate-in fade-in slide-in-from-bottom-2 duration-300">
              <img src={c.avatar} className="w-7 h-7 rounded-full shrink-0 object-cover border border-slate-200 shadow-sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{c.memberName}</span>
                    <span className="text-[9px] font-medium text-slate-400 shrink-0">{formatRelativeTime(c.time)}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingCommentId(c.id); setEditCommentBody(c.body); }} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteTaskComment(taskId, c.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm relative">
                  <div className="absolute top-2 -left-[5px] w-2 h-2 bg-white border-l border-t border-slate-200 rotate-[-45deg]" />
                  {editingCommentId === c.id ? (
                    <div className="relative z-10">
                      <textarea
                        value={editCommentBody}
                        onChange={(e) => setEditCommentBody(e.target.value)}
                        className="w-full text-xs p-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[var(--primary)] min-h-[50px] resize-none"
                      />
                      <div className="flex justify-end gap-1 mt-1">
                        <button onClick={() => setEditingCommentId(null)} className="text-[10px] font-medium px-2 py-1 rounded text-slate-500 hover:bg-slate-100">Cancel</button>
                        <button onClick={() => { updateTaskComment(taskId, c.id, editCommentBody); setEditingCommentId(null); }} className="text-[10px] font-medium px-2 py-1 rounded text-white bg-[var(--primary)] hover:opacity-90">Save</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-slate-700 leading-relaxed relative z-10 whitespace-pre-wrap">{c.body}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-50">
            <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
            <p className="text-xs font-medium text-slate-500">No comments yet. Start the conversation!</p>
          </div>
        )}
      </div>
      <form onSubmit={handleAddComment} className="p-4 bg-white border-t border-slate-200 shrink-0">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full h-10 rounded-full border border-slate-200 pl-4 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] bg-slate-50"
          />
          <button type="submit" disabled={!newComment.trim()} className="absolute right-1.5 p-1.5 text-white bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-full disabled:opacity-50 transition-all">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
