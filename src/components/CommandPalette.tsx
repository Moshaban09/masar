import { useEffect, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command"
import { useNavigate } from "react-router-dom"
import { Home, Briefcase, CheckSquare, Users, Calendar, Bell, Settings, CheckCircle2, LayoutGrid } from "lucide-react"
import { useWorkspace } from "../store/useWorkspace"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { projects, tasks, members } = useWorkspace()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search... (Cmd/Ctrl + K)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
            <Home className="mr-2 h-4 w-4 text-slate-500" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/projects"))}>
            <Briefcase className="mr-2 h-4 w-4 text-slate-500" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/tasks"))}>
            <CheckSquare className="mr-2 h-4 w-4 text-slate-500" />
            <span>Tasks</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/team"))}>
            <Users className="mr-2 h-4 w-4 text-slate-500" />
            <span>Team</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/calendar"))}>
            <Calendar className="mr-2 h-4 w-4 text-slate-500" />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/notifications"))}>
            <Bell className="mr-2 h-4 w-4 text-slate-500" />
            <span>Notifications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <Settings className="mr-2 h-4 w-4 text-slate-500" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        
        <CommandGroup heading="Projects">
          {projects.map(p => (
            <CommandItem key={p.id} onSelect={() => runCommand(() => navigate(`/projects/${p.id}`))}>
              <LayoutGrid className="mr-2 h-4 w-4 text-[var(--primary)]" />
              <span>{p.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Recent Tasks">
          {tasks.slice(0, 5).map(t => (
            <CommandItem key={t.id} onSelect={() => runCommand(() => navigate(`/tasks`))}>
              <CheckCircle2 className={`mr-2 h-4 w-4 ${t.status === 'done' ? 'text-green-500' : 'text-slate-400'}`} />
              <span className={t.status === 'done' ? 'line-through text-slate-500' : ''}>{t.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Team Members">
          {members.map(m => (
            <CommandItem key={m.id} onSelect={() => runCommand(() => navigate(`/team`))}>
              <Users className="mr-2 h-4 w-4 text-[var(--primary)]" />
              <span>{m.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
