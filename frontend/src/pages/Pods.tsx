import { useState } from 'react';
import { usePods, type SettlementTransaction } from '../hooks/usePods';
import { useAuthStore } from '../store/useAuthStore';
import { formatCurrency } from '../lib/utils';
import { Users, Plus, Mail, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export default function Pods() {
  const { pods, isLoading, createPod, inviteMember, getSettlementPlan, settleUp } = usePods();
  const user = useAuthStore((state) => state.user);
  const currency = user?.currency || 'USD';

  const [newPodName, setNewPodName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
  const [settlementPlans, setSettlementPlans] = useState<Record<string, SettlementTransaction[]>>({});
  const [isSettled, setIsSettled] = useState<Record<string, boolean>>({});

  const handleCreatePod = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPodName.trim()) {
      createPod(newPodName.trim());
      setNewPodName('');
    }
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteEmail.trim() && selectedPodId) {
      inviteMember({ podId: selectedPodId, email: inviteEmail.trim() });
      setInviteEmail('');
    }
  };

  const handleLoadSettlement = async (podId: string) => {
    const plan = await getSettlementPlan(podId);
    setSettlementPlans((prev) => ({ ...prev, [podId]: plan }));
  };

  const handleSettleUp = (podId: string) => {
    settleUp(podId);
    setIsSettled((prev) => ({ ...prev, [podId]: true }));
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading shared pods...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
            Shared Pods
          </h2>
          <p className="text-muted-foreground text-sm">
            Split group expenses, track shared trips or roommates, and settle up balances.
          </p>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Create Pod Card */}
        <div className="rounded-2xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base">Create New Pod</h3>
              <p className="text-xs text-muted-foreground">Start sharing expenses with a group</p>
            </div>
          </div>

          <form onSubmit={handleCreatePod} className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Pod Group Name</label>
              <input
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="e.g. Ski Trip 2026, Flat 4B"
                value={newPodName}
                onChange={(e) => setNewPodName(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              disabled={!newPodName.trim()}
            >
              Create Pod
            </button>
          </form>
        </div>

        {/* Pods List */}
        <div className="lg:col-span-2 space-y-4">
          {pods.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground space-y-2">
              <Users className="h-9 w-9 mx-auto text-muted-foreground/60" />
              <p className="font-medium text-foreground">No shared pods yet</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Create a Pod to split rent, vacations, or group dinners effortlessly.
              </p>
            </div>
          ) : (
            pods.map((pod) => {
              const isSelected = selectedPodId === pod.id;
              const plan = settlementPlans[pod.id];
              const settled = isSettled[pod.id];

              return (
                <div
                  key={pod.id}
                  className={`rounded-2xl border bg-card text-card-foreground shadow-sm p-6 transition-all ${
                    isSelected ? 'border-primary shadow-md' : 'hover:border-primary/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 font-bold">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-foreground">{pod.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {pod.members.length} {pod.members.length === 1 ? 'member' : 'members'} • Created {pod.createdAt}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedPodId(isSelected ? null : pod.id)}
                        className={`inline-flex items-center justify-center rounded-xl text-xs font-medium px-3.5 py-2 transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-input bg-background hover:bg-muted text-foreground'
                        }`}
                      >
                        {isSelected ? 'Done Managing' : 'Manage & Invite'}
                      </button>
                    </div>
                  </div>

                  {/* Members list */}
                  <div className="mt-4">
                    <span className="text-xs font-medium text-muted-foreground block mb-2">Members:</span>
                    <div className="flex flex-wrap gap-2">
                      {pod.members.map((m) => (
                        <div
                          key={m.userId || m.email}
                          className="inline-flex items-center gap-1.5 rounded-full border bg-muted/30 px-3 py-1 text-xs font-medium"
                        >
                          <UserCheck className="h-3 w-3 text-primary" />
                          <span>{m.firstName ? `${m.firstName} ${m.lastName || ''}`.trim() : m.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manage Drawer */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {/* Invite form */}
                      <form onSubmit={handleInvite} className="flex gap-2">
                        <div className="relative flex-1">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <input
                            className="flex h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Add member by email..."
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!inviteEmail.trim()}
                          className="inline-flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 text-xs font-medium disabled:opacity-50"
                        >
                          Invite
                        </button>
                      </form>

                      {/* Settle Up Section */}
                      <div className="rounded-xl border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Settlement Radar
                            </h4>
                            <p className="text-xs text-muted-foreground">Minimizes transactions between members</p>
                          </div>
                          {!plan && (
                            <button
                              onClick={() => handleLoadSettlement(pod.id)}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Calculate Balances
                            </button>
                          )}
                        </div>

                        {settled ? (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-medium p-2 bg-emerald-500/10 rounded-lg">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>All balances settled! No pending debts in this group.</span>
                          </div>
                        ) : plan && plan.length > 0 ? (
                          <div className="space-y-2">
                            {plan.map((tx, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs font-medium"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Marcus Vance</span>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-foreground">Alex Rivera (You)</span>
                                </div>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                  {formatCurrency(tx.amount, currency)}
                                </span>
                              </div>
                            ))}
                            <button
                              onClick={() => handleSettleUp(pod.id)}
                              className="mt-2 inline-flex h-9 w-full items-center justify-center rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors shadow-sm"
                            >
                              Mark Pod As Settled
                            </button>
                          </div>
                        ) : plan ? (
                          <p className="text-xs text-muted-foreground">No pending debt found for this pod.</p>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
