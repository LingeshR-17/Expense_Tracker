import { useMemo, useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useTransactions } from "../hooks/useTransactions"
import { useCategories } from "../hooks/useCategories"
import { formatCurrency } from "../lib/utils"
import { DEMO_USER } from "../lib/storageEngine"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts"
import { format, parseISO, subDays } from "date-fns"
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Receipt, 
  Sparkles,
  PieChart as PieIcon
} from "lucide-react"
import { Link } from "react-router-dom"
import AddTransactionModal from "../components/transactions/AddTransactionModal"

export default function DashboardOverview() {
  const user = useAuthStore((state) => state.user)
  const currency = user?.currency || "INR"
  const isDemo = user?.id === DEMO_USER.id || user?.accountType === "demo"
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { transactions } = useTransactions()
  const { categories } = useCategories()

  const txList = useMemo(() => {
    if (!transactions) return []
    if (Array.isArray(transactions)) return transactions
    if ('content' in transactions && Array.isArray((transactions as any).content)) {
      return (transactions as any).content
    }
    return []
  }, [transactions])

  // Real-time dynamic financial statistics
  const stats = useMemo(() => {
    let totalIncome = 0
    let totalExpenses = 0

    txList.forEach((tx: any) => {
      const amount = Number(tx.amount) || 0
      if (tx.type === "INCOME") {
        totalIncome += amount
      } else if (tx.type === "EXPENSE") {
        totalExpenses += amount
      }
    })

    const netBalance = totalIncome - totalExpenses
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)) : 0

    return {
      netBalance,
      totalIncome,
      totalExpenses,
      savingsRate,
      txCount: txList.length,
    }
  }, [txList])

  // Dynamic 30-day cash flow chart data
  const cashFlowData = useMemo(() => {
    if (txList.length === 0) return []

    // Group expenses and income by date buckets over last 30 days
    const dateMap: Record<string, { income: number; expense: number }> = {}
    
    // Seed the last 7 time periods or daily entries
    for (let i = 28; i >= 0; i -= 4) {
      const d = format(subDays(new Date(), i), "MMM dd")
      dateMap[d] = { income: 0, expense: 0 }
    }

    txList.forEach((tx: any) => {
      try {
        const txDate = format(parseISO(tx.transactionDate), "MMM dd")
        if (!dateMap[txDate]) {
          dateMap[txDate] = { income: 0, expense: 0 }
        }
        if (tx.type === "INCOME") {
          dateMap[txDate].income += Number(tx.amount) || 0
        } else if (tx.type === "EXPENSE") {
          dateMap[txDate].expense += Number(tx.amount) || 0
        }
      } catch {
        // Skip invalid date
      }
    })

    return Object.entries(dateMap).map(([date, values]) => ({
      date,
      income: Math.round(values.income),
      expense: Math.round(values.expense),
    }))
  }, [txList])

  // Dynamic Category Spending Data for Donut Chart
  const categoryChartData = useMemo(() => {
    const expenseList = txList.filter((t: any) => t.type === "EXPENSE")
    if (expenseList.length === 0) return []

    const map: Record<string, { value: number; color: string }> = {}

    expenseList.forEach((tx: any) => {
      const catName = tx.categoryName || "General"
      if (!map[catName]) {
        const matchedCat = categories?.find((c) => c.name === catName || c.id === tx.categoryId)
        map[catName] = {
          value: 0,
          color: matchedCat?.color || "#6366f1",
        }
      }
      map[catName].value += Number(tx.amount) || 0
    })

    return Object.entries(map)
      .map(([name, item]) => ({
        name,
        value: Math.round(item.value),
        color: item.color,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6) // Top 6 categories
  }, [txList, categories])

  const recentTransactions = useMemo(() => {
    return txList.slice(0, 5)
  }, [txList])

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
              Overview
            </h2>
            {isDemo ? (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Demo Dataset
              </span>
            ) : (
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                Fresh Workspace
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Welcome back, {user?.firstName}! Here is your current financial summary.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm gap-2"
        >
          <Plus className="h-4 w-4" /> Add Transaction
        </button>
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Financial Stat Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Net Balance */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Balance
            </span>
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-heading text-foreground">
            {formatCurrency(stats.netBalance, currency)}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{stats.txCount}</span> total logged transactions
          </div>
        </div>

        {/* Monthly Income */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Income
            </span>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
            +{formatCurrency(stats.totalIncome, currency)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active earning period</span>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Expenses
            </span>
            <div className="rounded-xl bg-destructive/10 p-2 text-destructive">
              <ArrowDownLeft className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-heading text-destructive">
            -{formatCurrency(stats.totalExpenses, currency)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            <span>Across all categories</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Savings Rate
            </span>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-heading text-foreground">
            {stats.savingsRate}%
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Net cash preserved</span>
          </div>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        
        {/* Cash Flow Area Chart */}
        <div className="rounded-2xl border bg-card shadow-sm lg:col-span-4 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold font-heading text-foreground">Cash Flow Trend</h3>
                <p className="text-xs text-muted-foreground">Income versus expenses over the logged timeline</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Income</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="text-muted-foreground">Expense</span>
                </div>
              </div>
            </div>

            {cashFlowData.length > 0 ? (
              <div className="h-[280px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="#888888" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(v) => formatCurrency(v, currency).replace(/\.00$/, '')} 
                    />
                    <Tooltip 
                      formatter={(val: any) => [formatCurrency(Number(val) || 0, currency), '']}
                      contentStyle={{ borderRadius: '12px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorIncome)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#f43f5e" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorExpense)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 space-y-2">
                <p className="text-sm font-medium text-foreground">No cashflow data yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Your income and expense trend chart will render automatically as you log transactions.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  <Plus className="h-3 w-3" /> Log First Transaction
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Expenses by Category Donut Chart */}
        <div className="rounded-2xl border bg-card shadow-sm lg:col-span-3 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold font-heading text-foreground">Expenses by Category</h3>
                <p className="text-xs text-muted-foreground">Breakdown of your spending allocation</p>
              </div>
              <PieIcon className="h-4 w-4 text-muted-foreground" />
            </div>

            {categoryChartData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(val: any) => [formatCurrency(Number(val) || 0, currency), 'Amount']}
                        contentStyle={{ borderRadius: '12px', background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Mini Legend List */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                  {categoryChartData.slice(0, 4).map((c) => (
                    <div key={c.name} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="truncate text-muted-foreground">{c.name}</span>
                      <span className="ml-auto font-medium text-foreground">{formatCurrency(c.value, currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[240px] flex flex-col items-center justify-center rounded-xl border border-dashed text-center p-6 space-y-2">
                <p className="text-sm font-medium text-foreground">No expenses recorded</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Category proportion donuts will appear here once you record your first expenses.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Transactions List */}
      <div className="rounded-2xl border bg-card shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold font-heading text-foreground">Recent Transactions</h3>
            <p className="text-xs text-muted-foreground">Latest financial activity in your account</p>
          </div>
          <Link
            to="/dashboard/transactions"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            View all transactions <Receipt className="h-3 w-3" />
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
            <p className="text-sm font-medium text-foreground">Your account is clean and ready</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Start by logging an income deposit or recording your first expense to begin tracking.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" /> Add Transaction
            </button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTransactions.map((tx: any) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-4 hover:bg-muted/30 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${tx.type === 'EXPENSE' ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    {tx.type === 'EXPENSE' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">{tx.description}</p>
                    <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                      {tx.categoryName} • {format(parseISO(tx.transactionDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${tx.type === 'EXPENSE' ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {tx.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(tx.amount, currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
