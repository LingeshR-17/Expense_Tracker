import { useState, useEffect } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useCategories } from '../../hooks/useCategories';
import { usePods } from '../../hooks/usePods';
import { X } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { createTransaction } = useTransactions();
  const { categories } = useCategories();
  const { pods } = usePods();

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('EXPENSE');

  // Pod Split State
  const [enableSplit, setEnableSplit] = useState(false);
  const [selectedPodId, setSelectedPodId] = useState('');
  const [splitType, setSplitType] = useState('EVEN');
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId('');
      setType('EXPENSE');
      setEnableSplit(false);
      setSelectedPodId('');
      setSplitType('EVEN');
      setCustomSplits({});
    } else if (categories && categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [isOpen, categories]);

  const selectedPod = pods.find(p => p.id === selectedPodId);

  const handleCustomSplitChange = (userId: string, value: string) => {
    setCustomSplits(prev => ({ ...prev, [userId]: value }));
  };

  const getCustomTotal = () => {
    return Object.values(customSplits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return;

    if (enableSplit && splitType === 'CUSTOM') {
      const total = getCustomTotal();
      if (Math.abs(total - amountNum) > 0.01) {
        alert(`Custom split total (${total}) must equal transaction amount (${amountNum})`);
        return;
      }
    }

    const payload: any = {
      amount: amountNum,
      description,
      transactionDate: date,
      categoryId,
      type,
    };

    if (enableSplit && selectedPodId) {
      payload.podId = selectedPodId;
      payload.splitType = splitType;
      
      const splits: Record<string, number> = {};
      if (splitType === 'EVEN' && selectedPod) {
        const perPerson = amountNum / selectedPod.members.length;
        selectedPod.members.forEach(m => {
          if (m.userId) splits[m.userId] = perPerson;
        });
      } else if (splitType === 'CUSTOM') {
        Object.entries(customSplits).forEach(([userId, val]) => {
          splits[userId] = parseFloat(val) || 0;
        });
      }
      payload.splits = splits;
    }

    if (createTransaction && typeof (createTransaction as any).mutate === 'function') {
      createTransaction.mutate(payload);
    } else if (typeof createTransaction === 'function') {
      (createTransaction as any)(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card text-card-foreground w-full max-w-lg rounded-xl shadow-lg border">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Transaction</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="tx-type" className="text-sm font-medium">Type</label>
              <select 
                id="tx-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="tx-amount" className="text-sm font-medium">Amount</label>
              <input 
                id="tx-amount"
                type="number"
                step="0.01"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="tx-description" className="text-sm font-medium">Description</label>
            <input 
              id="tx-description"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="tx-date" className="text-sm font-medium">Date</label>
              <input 
                id="tx-date"
                type="date"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tx-category" className="text-sm font-medium">Category</label>
              <select 
                id="tx-category"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="" disabled>Select category...</option>
                {categories?.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.icon ? `${c.icon} ` : ''}{c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pod Split Section */}
          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="enableSplit"
                checked={enableSplit}
                onChange={(e) => setEnableSplit(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="enableSplit" className="text-sm font-medium">
                Split with a Pod
              </label>
            </div>

            {enableSplit && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label htmlFor="tx-pod" className="text-sm font-medium">Select Pod</label>
                  <select 
                    id="tx-pod"
                    required={enableSplit}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedPodId}
                    onChange={(e) => setSelectedPodId(e.target.value)}
                  >
                    <option value="" disabled>Select pod...</option>
                    {pods?.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {selectedPod && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Split Type</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input type="radio" value="EVEN" checked={splitType === 'EVEN'} onChange={(e) => setSplitType(e.target.value)} />
                        <span className="text-sm">Evenly ({selectedPod.members.length} ways)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="radio" value="CUSTOM" checked={splitType === 'CUSTOM'} onChange={(e) => setSplitType(e.target.value)} />
                        <span className="text-sm">Custom Amounts</span>
                      </label>
                    </div>

                    {splitType === 'CUSTOM' && (
                      <div className="mt-4 space-y-2 border-t pt-2">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Running Total: ₹{getCustomTotal().toFixed(2)}</span>
                          <span className={Math.abs(getCustomTotal() - (parseFloat(amount) || 0)) < 0.01 ? 'text-emerald-500' : 'text-destructive'}>
                            Target: ₹{parseFloat(amount) || 0}
                          </span>
                        </div>
                        {selectedPod.members.map(m => (
                          <div key={m.userId} className="flex items-center justify-between gap-4">
                            <span className="text-sm truncate">{m.firstName || m.email}</span>
                            <input 
                              type="number" 
                              step="0.01"
                              className="flex h-8 w-24 rounded-md border border-input bg-background px-2 py-1 text-sm text-right"
                              value={customSplits[m.userId] || ''}
                              onChange={(e) => handleCustomSplitChange(m.userId, e.target.value)}
                              placeholder="0.00"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
