import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useAuth } from '../../store/useAuth';
import { useNavigate } from 'react-router-dom';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 border-l border-slate-200 pl-4 ml-2 cursor-pointer group">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-900 leading-none group-hover:text-[var(--primary)] transition-colors">{user?.name}</span>
            <span className="text-xs text-slate-500 mt-1 leading-none capitalize">{user?.plan} Plan</span>
          </div>
          <Avatar className="h-8 w-8 ring-2 ring-transparent group-hover:ring-[var(--primary)] transition-all">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-slate-100 text-slate-600">
              {user?.name?.substring(0, 2).toUpperCase() || 'US'}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            logout();
            navigate('/');
          }} 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
