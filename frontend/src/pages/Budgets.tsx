import { useState, useMemo } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { useCategories } from '../hooks/useCategories';
import { useTransactions } from '../hooks/useTransactions';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { Plus, Target, AlertTriangle, CheckCircle2, Trash2, X } from 'lucide-react';

export default function Budgets() {
  const { budgets, isLoading, saveBudget, deleteBudget } = useBudgets();
  const { categories } = useCategories();
  const { transactions } = useTransactions();
  const user = useAuthStore((state) => state.user);
  const currency = user?.currency || 'USD';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const txList = useMemo(() => {
    if (!transactions) return [];
    if (Array.isArray(transactions)) return transactions;
    if ('content' in transactions && Array.isArray((transactions as any).content)) {
      return (transactions as any).content;
    }
    return [];
  }, [transactions]);

  // Compute total spent per category in current period
  const spendingPerCategory = useMemo(() => {
    const map: Record<string, number> = {};
    txList.forEach((tx: any) => {
      if (tx.type === 'EXPENSE') {
        const catId = tx.categoryId;
        map[catId] = (map[catId] || 0) + (Number(tx.amount) || 0);
      }
    });
    return map;
  }, [txList]);

  // Global budget summary
  const summary = useMemo(() => {
    let totalBudgeted = 0;
    let totalSpentInBudgets = 0;

    budgets.forEach((b) => {
      totalBudgeted += Number(b.monthlyLimit) || 0;
      totalSpentInBudgets += spendingPerCategory[b.categoryId] || 0;
    });

    const remaining = totalBudgeted - totalSpentInBudgets;
    const percentUsed = totalBudgeted > 0 ? Math.min(100, Math.round((totalSpentInBudgets / totalBudgeted) * 100)) : 0;

    return { totalBudgeted, totalSpentInBudgets, remaining, percentUsed };
  }, [budgets, spendingPerCategory]);

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(limitAmount);
    if (!selectedCategoryId || !amountNum || amountNum <= 0) return;

    saveBudget.mutate({
      categoryId: selectedCategoryId,
      monthlyLimit: amountNum,
    });

    setSelectedCategoryId('');
    setLimitAmount('');
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading budgets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
            Budgets
          </h2>
          <p className="text-muted-foreground text-sm">
            Set monthly spending ceilings per category and keep your cash flow on track.
          </p>
        </div>
        <button
          onClick={() => {
            if (categories && categories.length > 0 && !selectedCategoryId) {
              setSelectedCategoryId(categories[0].id);
            }
            setIsModalOpen(true);
          }}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm gap-2"
        >
          <Plus className="h-4 w-4" /> Set Category Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Monthly Budget
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-heading text-foreground">
            {formatCurrency(summary.totalBudgeted, currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Across {budgets.length} categories</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Total Spent
          </span>
          <p className="mt-2 text-2xl sm:text-3xl font-bold font-heading text-destructive">
            {formatCurrency(summary.totalSpentInBudgets, currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{summary.percentUsed}% of total budget consumed</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Remaining Allowance
          </span>
          <p className={`mt-2 text-2xl sm:text-3xl font-bold font-heading ${summary.remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
            {summary.remaining < 0 ? '-' : ''}{formatCurrency(Math.abs(summary.remaining), currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{summary.remaining >= 0 ? 'Safe margin remaining' : 'Over budget'}</p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Health Status
          </span>
          <div className="mt-2 flex items-center gap-2">
            {summary.remaining >= 0 ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                <span className="text-xl font-bold text-foreground font-heading">On Track</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-6 w-6 text-rose-500" />
                <span className="text-xl font-bold text-rose-500 font-heading">Review Spending</span>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Refreshes monthly</p>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed p-12 text-center text-muted-foreground space-y-3">
            <Target className="h-9 w-9 mx-auto text-muted-foreground/60" />
            <p className="font-medium text-foreground">No category budgets created yet</p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Setting budget caps helps you control spending on Groceries, Dining, Subscriptions, and more.
            </p>
            <button
              onClick={() => {
                if (categories && categories.length > 0) setSelectedCategoryId(categories[0].id);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Create First Budget
            </button>
          </div>
        ) : (
          budgets.map((budget) => {
            const cat = categories?.find((c) => c.id === budget.categoryId || c.name === budget.categoryName);
            const spent = spendingPerCategory[budget.categoryId] || 0;
            const limit = budget.monthlyLimit || 1;
            const percent = Math.min(100, Math.round((spent / limit) * 100));
            const isExceeded = spent > limit;

            return (
              <div
                key={budget.id}
                className="group relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow hover:border-primary/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                        style={{ backgroundColor: `${cat?.color || '#3b82f6'}20` }}
                      >
                        {cat?.icon || '🎯'}
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-base text-foreground">
                          {budget.categoryName}
                        </h3>
                        <span className="text-xs text-muted-foreground">Monthly Cap</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteBudget.mutate(budget.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Amounts */}
                  <div className="mt-4 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold font-heading text-foreground">
                        {formatCurrency(spent, currency)}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1.5">
                        of {formatCurrency(limit, currency)}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${isExceeded ? 'text-rose-500' : 'text-muted-foreground'}`}>
                      {percent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-2 h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isExceeded
                          ? 'bg-rose-500'
                          : percent >= 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {isExceeded ? 'Exceeded by' : 'Remaining:'}
                  </span>
                  <span className={`font-semibold ${isExceeded ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {formatCurrency(Math.abs(limit - spent), currency)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Set Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-heading font-bold text-foreground">Set Category Budget</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Select Category</label>
                <select
                  required
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="" disabled>Choose category...</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon ? `${c.icon} ` : ''}{c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Monthly Limit ({currency})</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="e.g. 400"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedCategoryId || !limitAmount}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
