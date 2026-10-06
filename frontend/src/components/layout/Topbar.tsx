import { useAuthStore } from "../../store/useAuthStore"
import { useThemeStore } from "../../store/useThemeStore"
import { DEMO_USER, FRESH_USER } from "../../lib/storageEngine"
import { Moon, Sun, LogOut, PlayCircle, Sparkles, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"

export default function Topbar() {
  const { user, logout, switchAccount } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isDemo = user?.id === DEMO_USER.id || user?.accountType === 'demo'
  const isFresh = user?.id === FRESH_USER.id || user?.accountType === 'fresh'

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSwitchAccount = (target: 'demo' | 'fresh') => {
    switchAccount(target)
    queryClient.clear() // clear all cached queries so new user data loads freshly
  }

  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate("/login")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card/80 backdrop-blur-md px-4 sm:px-6 sticky top-0 z-30 transition-colors">
      
      {/* Interface Mode Indicator & Fast Switcher */}
      <div className="flex items-center gap-2 sm:gap-3">
        {isDemo ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <PlayCircle className="h-3.5 w-3.5" />
              <span>Demo Mode (1-Month Data)</span>
            </span>
            <button
              onClick={() => handleSwitchAccount('fresh')}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              title="Switch to Fresh Personal Account"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">Switch to Fresh</span>
              <span className="sm:hidden">Fresh</span>
            </button>
          </div>
        ) : isFresh ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Personal Account (Clean Slate)</span>
            </span>
            <button
              onClick={() => handleSwitchAccount('demo')}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
              title="Switch to 1-Month Demo Account"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">Switch to Demo</span>
              <span className="sm:hidden">Demo</span>
            </button>
          </div>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Custom User</span>
          </span>
        )}
      </div>

      {/* Right Controls: Theme Toggle, User Chip & Logout */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary ring-1 ring-primary/20">
            {user?.firstName?.charAt(0) || "U"}{user?.lastName?.charAt(0) || ""}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-tight">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight font-mono">
              {user?.currency || 'INR'}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-1"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
