import { NavLink } from "react-router-dom"
import { LayoutDashboard, Receipt, PieChart, Target, Users, Settings, Wallet, PlayCircle, Sparkles } from "lucide-react"
import { useAuthStore } from "../../store/useAuthStore"
import { DEMO_USER } from "../../lib/storageEngine"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Categories", href: "/dashboard/categories", icon: PieChart },
  { name: "Budgets", href: "/dashboard/budgets", icon: Target },
  { name: "Pods", href: "/dashboard/pods", icon: Users },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const isDemo = user?.id === DEMO_USER.id || user?.accountType === 'demo'

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card px-3 py-5 justify-between select-none">
      <div>
        {/* Brand */}
        <div className="mb-6 px-3 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight leading-none">
              FinFlow
            </h1>
            <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-semibold">
              Personal Wealth
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Account Badge footer */}
      <div className="p-3 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-muted-foreground">Active Interface:</span>
          {isDemo ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <PlayCircle className="h-3 w-3" /> DEMO
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3 w-3" /> FRESH
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-foreground truncate">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="text-[11px] text-muted-foreground truncate font-mono">
          {user?.email}
        </p>
      </div>
    </div>
  )
}
