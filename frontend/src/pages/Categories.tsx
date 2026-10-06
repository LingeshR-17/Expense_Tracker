import { useState, useMemo } from "react"
import { useCategories } from "../hooks/useCategories"
import { useTransactions } from "../hooks/useTransactions"
import { useAuthStore } from "../store/useAuthStore"
import { formatCurrency } from "../lib/utils"
import { Plus, X, Tag } from "lucide-react"

const EMOJI_OPTIONS = ["🍔", "🏠", "🚗", "🎮", "💼", "✈️", "🛒", "💊", "⚡", "☕", "📱", "📚", "🏋️", "🎁", "🎨", "🐾"]
const COLOR_OPTIONS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Rose/Red
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6366f1", // Indigo
  "#f97316", // Orange
  "#14b8a6", // Teal
]

export default function Categories() {
  const { categories, isLoading, createCategory } = useCategories()
  const { transactions } = useTransactions()
  const user = useAuthStore((state) => state.user)
  const currency = user?.currency || "INR"

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [selectedEmoji, setSelectedEmoji] = useState("🏷️")
  const [selectedColor, setSelectedColor] = useState("#3b82f6")

  const txList = useMemo(() => {
    if (!transactions) return []
    if (Array.isArray(transactions)) return transactions
    if ('content' in transactions && Array.isArray((transactions as any).content)) {
      return (transactions as any).content
    }
    return []
  }, [transactions])

  // Compute spend and count per category
  const categoryStats = useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {}
    txList.forEach((tx: any) => {
      if (tx.type === "EXPENSE") {
        const catId = tx.categoryId
        if (!stats[catId]) {
          stats[catId] = { total: 0, count: 0 }
        }
        stats[catId].total += Number(tx.amount) || 0
        stats[catId].count += 1
      }
    })
    return stats
  }, [txList])

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    createCategory.mutate({
      name: newCatName.trim(),
      icon: selectedEmoji,
      color: selectedColor,
      isCustom: true,
    })

    setNewCatName("")
    setSelectedEmoji("🏷️")
    setSelectedColor("#3b82f6")
    setIsModalOpen(false)
  }

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading categories...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
            Categories
          </h2>
          <p className="text-muted-foreground text-sm">
            Organize and classify your income and expenses with visual badges.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all shadow-sm gap-2"
        >
          <Plus className="h-4 w-4" /> New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {!categories || categories.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            <Tag className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
            <p className="font-medium text-foreground">No categories defined yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first custom category to organize expenses.</p>
          </div>
        ) : (
          categories.map((cat) => {
            const stat = categoryStats[cat.id] || { total: 0, count: 0 }
            return (
              <div 
                key={cat.id} 
                className="group relative flex flex-col justify-between rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div 
                      className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm" 
                      style={{ 
                        backgroundColor: `${cat.color || '#3b82f6'}18`, 
                        border: `1px solid ${cat.color || '#3b82f6'}35`
                      }}
                    >
                      {cat.icon || '📁'}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-base text-foreground leading-tight">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {cat.isCustom ? 'Custom Category' : 'Default Category'}
                      </span>
                    </div>
                  </div>

                  <span 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: cat.color || '#3b82f6' }}
                    title={cat.color || ''}
                  />
                </div>

                <div className="mt-5 pt-3 border-t flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {stat.count} {stat.count === 1 ? 'transaction' : 'transactions'}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(stat.total, currency)}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* New Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card text-card-foreground w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-heading font-bold text-foreground">Create New Category</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Category Name</label>
                <input 
                  required
                  placeholder="e.g. Pet Care, Gaming, Side Gig"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* Emoji Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Choose Icon</label>
                <div className="grid grid-cols-8 gap-2 p-2 rounded-xl border bg-muted/20">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`h-9 w-9 rounded-lg flex items-center justify-center text-lg transition-transform ${
                        selectedEmoji === emoji ? 'bg-primary/20 scale-110 ring-2 ring-primary' : 'hover:bg-muted'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Swatches */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Badge Color</label>
                <div className="flex flex-wrap gap-2.5">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-primary' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground block mb-2">Live Preview:</span>
                <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                  <div 
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                    style={{ backgroundColor: `${selectedColor}20` }}
                  >
                    {selectedEmoji}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{newCatName || "Category Name"}</p>
                    <p className="text-xs text-muted-foreground">Custom Category</p>
                  </div>
                </div>
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
                  disabled={!newCatName.trim()}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
