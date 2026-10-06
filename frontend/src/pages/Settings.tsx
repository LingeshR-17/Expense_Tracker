import { useState } from 'react';
import { useRules } from '../hooks/useRules';
import { useTransactions } from '../hooks/useTransactions';
import { useAuthStore } from '../store/useAuthStore';
import { storageEngine, DEMO_USER } from '../lib/storageEngine';
import { useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '../lib/utils';
import { 
  User, 
  Coins, 
  Repeat, 
  RotateCcw, 
  Trash2, 
  Check, 
  Sparkles, 
  PlayCircle, 
  Shield 
} from 'lucide-react';

export default function Settings() {
  const { rules, isLoading, createRule, deleteRule } = useRules();
  const { transactions } = useTransactions();
  const { user, updateCurrency, switchAccount } = useAuthStore();
  const queryClient = useQueryClient();

  const isDemo = user?.id === DEMO_USER.id || user?.accountType === 'demo';
  const currency = user?.currency || 'INR';

  const [transactionId, setTransactionId] = useState('');
  const [frequency, setFrequency] = useState<'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [nextDueDate, setNextDueDate] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const txList = Array.isArray(transactions) ? transactions : (transactions?.content || []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionId && nextDueDate) {
      createRule({ transactionId, frequency, nextDueDate });
      setTransactionId('');
      setNextDueDate('');
      setStatusNotice('Recurring rule added successfully!');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const handleCurrencyChange = (newCurr: string) => {
    updateCurrency(newCurr);
    setStatusNotice(`Default currency set to ${newCurr}`);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all Demo data back to the original 1-month synthetic dataset?')) {
      storageEngine.resetDemoData();
      queryClient.clear();
      setStatusNotice('Demo data restored to original 1-month dataset!');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
          Settings & Preferences
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage your profile, preferred currency, account mode, and recurring automation rules.
        </p>
      </div>

      {statusNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4" />
          <span>{statusNotice}</span>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Profile & Account Identity */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base">Account Profile</h3>
              <p className="text-xs text-muted-foreground">Active identity and current session</p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-medium text-foreground">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-mono text-xs text-foreground">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b">
              <span className="text-muted-foreground">Interface Mode:</span>
              {isDemo ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <PlayCircle className="h-3 w-3" /> Demo Account (1-Month Data)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-3 w-3" /> Personal Fresh Account
                </span>
              )}
            </div>
          </div>

          {/* Quick Account Switch Buttons */}
          <div className="pt-2">
            <span className="text-xs font-medium text-muted-foreground block mb-2">Switch Active Identity:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  switchAccount('demo');
                  queryClient.clear();
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  isDemo ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <PlayCircle className="h-4 w-4" /> Demo Mode
              </button>
              <button
                onClick={() => {
                  switchAccount('fresh');
                  queryClient.clear();
                }}
                className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  !isDemo ? 'border-blue-500 bg-blue-500/10 text-blue-600' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Sparkles className="h-4 w-4" /> Fresh Account
              </button>
            </div>
          </div>

          {/* Reset Demo Data (if on demo) */}
          {isDemo && (
            <div className="pt-3 border-t">
              <button
                onClick={handleResetDemoData}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 hover:bg-destructive/15 text-destructive p-2.5 text-xs font-medium transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restore Original 1-Month Synthetic Data
              </button>
            </div>
          )}
        </div>

        {/* Currency & Localization */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base">Currency & Format</h3>
              <p className="text-xs text-muted-foreground">Select how currency amounts are formatted</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground block">Active Currency</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
                { code: 'USD', symbol: '$', label: 'US Dollar' },
                { code: 'EUR', symbol: '€', label: 'Euro' },
                { code: 'GBP', symbol: '£', label: 'British Pound' },
                { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
                { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleCurrencyChange(c.code)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    currency === c.code
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary'
                      : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <span className="text-lg font-bold">{c.symbol}</span>
                  <span className="text-xs font-mono">{c.code}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t">
            <span className="text-xs text-muted-foreground block mb-1">Example Formatting:</span>
            <span className="text-xl font-bold font-heading text-emerald-600 dark:text-emerald-400">
              {formatCurrency(125000.50, currency)}
            </span>
          </div>
        </div>

        {/* Create Recurring Automation Rule */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
              <Repeat className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base">Create Recurring Rule</h3>
              <p className="text-xs text-muted-foreground">Automate subscriptions or rent from past transactions</p>
            </div>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Template Transaction</label>
              <select
                required
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              >
                <option value="" disabled>Select a transaction...</option>
                {txList.map((tx: any) => (
                  <option key={tx.id} value={tx.id}>
                    {tx.description} - {formatCurrency(tx.amount, currency)} ({tx.transactionDate})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Frequency</label>
                <select
                  required
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Next Due Date</label>
                <input
                  type="date"
                  required
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={nextDueDate}
                  onChange={(e) => setNextDueDate(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!transactionId || !nextDueDate}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Create Automation Rule
            </button>
          </form>
        </div>

        {/* Active Rules List */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base">Active Automations</h3>
              <p className="text-xs text-muted-foreground">Subscriptions and scheduled obligations</p>
            </div>
          </div>

          <div className="space-y-3">
            {rules.length === 0 ? (
              <div className="rounded-xl border border-dashed p-8 text-center text-xs text-muted-foreground">
                No active recurring rules set up yet.
              </div>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm text-foreground">
                      {rule.description || `Rule: ${rule.transactionId.substring(0, 8)}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Runs {rule.frequency.toLowerCase()} • Next due: {rule.nextDueDate}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    title="Delete automation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
