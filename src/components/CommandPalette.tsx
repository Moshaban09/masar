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
import { useTheme } from "./ThemeProvider"
import { Home, Briefcase, CheckSquare, Users, Calendar, Bell, Settings, Moon, Sun, Laptop } from "lucide-react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { setTheme } = useTheme()

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
      <CommandInput placeholder="Type a command or search..." />
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
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4 text-slate-500" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4 text-slate-500" />
            <span>Dark Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
            <Laptop className="mr-2 h-4 w-4 text-slate-500" />
            <span>System Default</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
