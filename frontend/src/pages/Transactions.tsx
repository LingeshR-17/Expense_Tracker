import { useState, useEffect } from "react"
import type { TransactionSearchParams, PageResponse } from "../hooks/useTransactions"
import { useTransactions } from "../hooks/useTransactions"
import { useCategories } from "../hooks/useCategories"
import { useAuthStore } from "../store/useAuthStore"
import { formatCurrency } from "../lib/utils"
import { format, parseISO } from "date-fns"
import { Plus, Trash2, Search, FilterX, ChevronLeft, ChevronRight, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import AddTransactionModal from "../components/transactions/AddTransactionModal"

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { categories } = useCategories()
  const user = useAuthStore((state) => state.user)
  const currency = user?.currency || "INR"

  // Filter state
  const [keyword, setKeyword] = useState("")
  const [debouncedKeyword, setDebouncedKeyword] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [page, setPage] = useState(0)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword)
      setPage(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [keyword])

  // Reset page when other filters change
  useEffect(() => {
    setPage(0)
  }, [categoryId, startDate, endDate])

  const searchParams: TransactionSearchParams = {
    keyword: debouncedKeyword,
    categoryId,
    startDate,
    endDate,
    page,
    size: 10
  }

  const { transactions: rawData, isLoading, deleteTransaction } = useTransactions(searchParams)
  
  // Normalize response depending on if it's paginated
  const isPaginated = rawData && 'content' in rawData
  const txList = isPaginated ? (rawData as PageResponse<any>).content : (rawData as any[]) || []
  const totalPages = isPaginated ? (rawData as PageResponse<any>).totalPages : 1
  const totalElements = isPaginated ? (rawData as PageResponse<any>).totalElements : txList.length

  const clearFilters = () => {
    setKeyword("")
    setDebouncedKeyword("")
    setCategoryId("")
    setStartDate("")
    setEndDate("")
    setPage(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-heading font-bold tracking-tight text-foreground">
            Transactions
          </h2>
          <p className="text-muted-foreground text-sm">
            {totalElements} transactions recorded • Filter, search, or add new records.
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

      {/* Filter Bar */}
      <div className="rounded-2xl border bg-card p-4 shadow-sm flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search descriptions or categories..." 
              className="flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Category</label>
          <select 
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories?.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon ? `${c.icon} ` : ''}{c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-36 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">From</label>
          <input 
            type="date"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="w-full md:w-36 space-y-1">
          <label className="text-xs font-medium text-muted-foreground">To</label>
          <input 
            type="date"
            className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {(keyword || categoryId || startDate || endDate) && (
          <button 
            onClick={clearFilters}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-3 text-sm font-medium shadow-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors gap-1.5"
            title="Clear Filters"
          >
            <FilterX className="h-4 w-4" /> Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40 text-xs uppercase tracking-wider">
                <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Type</th>
                <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Date</th>
                <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Description</th>
                <th className="h-11 px-4 text-left font-semibold text-muted-foreground">Category</th>
                <th className="h-11 px-4 text-right font-semibold text-muted-foreground">Amount</th>
                <th className="h-11 px-4 text-center font-semibold text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground animate-pulse">
                    Loading transactions...
                  </td>
                </tr>
              ) : txList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-32 text-center text-muted-foreground">
                    <p className="font-medium text-foreground">No transactions found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {keyword || categoryId || startDate || endDate ? "Try adjusting your filters." : "Click 'Add Transaction' to record your first transaction."}
                    </p>
                  </td>
                </tr>
              ) : (
                txList.map((tx) => {
                  const matchedCat = categories?.find(c => c.id === tx.categoryId || c.name === tx.categoryName);
                  const isExp = tx.type === 'EXPENSE';
                  return (
                    <tr key={tx.id} className="transition-colors hover:bg-muted/40">
                      <td className="p-4 align-middle">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${isExp ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          {isExp ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground text-xs whitespace-nowrap">
                        {format(parseISO(tx.transactionDate), "MMM dd, yyyy")}
                      </td>
                      <td className="p-4 align-middle font-medium text-foreground">
                        {tx.description || "Expense"}
                      </td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background px-2.5 py-0.5 text-xs font-medium">
                          {matchedCat?.icon && <span>{matchedCat.icon}</span>}
                          {tx.categoryName}
                        </span>
                      </td>
                      <td className={`p-4 align-middle text-right font-semibold whitespace-nowrap ${isExp ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {isExp ? '-' : '+'}{formatCurrency(tx.amount, currency)}
                      </td>
                      <td className="p-4 align-middle text-center">
                        <button 
                          onClick={() => deleteTransaction.mutate(tx.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {isPaginated && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t bg-muted/20">
            <span className="text-xs text-muted-foreground">
              Page {page + 1} of {totalPages} ({totalElements} items)
            </span>
            <div className="flex gap-2">
              <button 
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
