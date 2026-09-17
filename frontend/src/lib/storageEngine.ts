import type { User, Transaction, Category, Pod, RecurringRule, Budget } from '../types';

export const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@finflow.com',
  firstName: 'Alex',
  lastName: 'Rivera',
  currency: 'USD',
  accountType: 'demo',
};

export const FRESH_USER: User = {
  id: 'fresh-user-id',
  email: 'user@finflow.com',
  firstName: 'Jordan',
  lastName: 'Lee',
  currency: 'USD',
  accountType: 'fresh',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-housing', name: 'Housing & Rent', icon: '🏠', color: '#3b82f6', isCustom: false },
  { id: 'cat-groceries', name: 'Groceries', icon: '🛒', color: '#10b981', isCustom: false },
  { id: 'cat-dining', name: 'Dining & Cafes', icon: '☕', color: '#f59e0b', isCustom: false },
  { id: 'cat-transport', name: 'Transportation', icon: '🚗', color: '#6366f1', isCustom: false },
  { id: 'cat-entertainment', name: 'Entertainment & Subs', icon: '🎬', color: '#ec4899', isCustom: false },
  { id: 'cat-utilities', name: 'Utilities & Bills', icon: '⚡', color: '#06b6d4', isCustom: false },
  { id: 'cat-shopping', name: 'Shopping & Gear', icon: '🛍️', color: '#8b5cf6', isCustom: false },
  { id: 'cat-health', name: 'Health & Wellness', icon: '💊', color: '#14b8a6', isCustom: false },
  { id: 'cat-income', name: 'Salary & Income', icon: '💰', color: '#22c55e', isCustom: false },
];

function getRelativeDate(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export function generateSyntheticOneMonthData(): {
  transactions: Transaction[];
  categories: Category[];
  pods: Pod[];
  rules: RecurringRule[];
  budgets: Budget[];
} {
  const categories = [...DEFAULT_CATEGORIES];

  const transactions: Transaction[] = [
    // Income
    {
      id: 'tx-inc-1',
      categoryId: 'cat-income',
      categoryName: 'Salary & Income',
      amount: 2850.00,
      currency: 'USD',
      transactionDate: getRelativeDate(28),
      description: 'TechCorp Bi-Weekly Salary',
      paymentMethod: 'Direct Deposit',
      type: 'INCOME',
      createdAt: getRelativeDate(28),
    },
    {
      id: 'tx-inc-2',
      categoryId: 'cat-income',
      categoryName: 'Salary & Income',
      amount: 650.00,
      currency: 'USD',
      transactionDate: getRelativeDate(20),
      description: 'Freelance Design Retainer',
      paymentMethod: 'Stripe',
      type: 'INCOME',
      createdAt: getRelativeDate(20),
    },
    {
      id: 'tx-inc-3',
      categoryId: 'cat-income',
      categoryName: 'Salary & Income',
      amount: 2850.00,
      currency: 'USD',
      transactionDate: getRelativeDate(14),
      description: 'TechCorp Bi-Weekly Salary',
      paymentMethod: 'Direct Deposit',
      type: 'INCOME',
      createdAt: getRelativeDate(14),
    },

    // Major Expenses
    {
      id: 'tx-exp-1',
      categoryId: 'cat-housing',
      categoryName: 'Housing & Rent',
      amount: 1450.00,
      currency: 'USD',
      transactionDate: getRelativeDate(27),
      description: 'Monthly Apartment Rent (Apt 4B)',
      paymentMethod: 'ACH Transfer',
      type: 'EXPENSE',
      createdAt: getRelativeDate(27),
    },
    {
      id: 'tx-exp-2',
      categoryId: 'cat-utilities',
      categoryName: 'Utilities & Bills',
      amount: 118.40,
      currency: 'USD',
      transactionDate: getRelativeDate(25),
      description: 'ConEd Electric & Gas',
      paymentMethod: 'Auto-Pay Debit',
      type: 'EXPENSE',
      createdAt: getRelativeDate(25),
    },
    {
      id: 'tx-exp-3',
      categoryId: 'cat-utilities',
      categoryName: 'Utilities & Bills',
      amount: 69.99,
      currency: 'USD',
      transactionDate: getRelativeDate(24),
      description: 'Fiber Gigabit Internet',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(24),
    },

    // Groceries (spread across month)
    {
      id: 'tx-exp-4',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries',
      amount: 112.30,
      currency: 'USD',
      transactionDate: getRelativeDate(26),
      description: 'Trader Joe’s Weekly Restock',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(26),
    },
    {
      id: 'tx-exp-5',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries',
      amount: 88.50,
      currency: 'USD',
      transactionDate: getRelativeDate(19),
      description: 'Whole Foods Market Produce',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(19),
    },
    {
      id: 'tx-exp-6',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries',
      amount: 64.20,
      currency: 'USD',
      transactionDate: getRelativeDate(12),
      description: 'Local Organic Supermarket',
      paymentMethod: 'Debit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(12),
    },
    {
      id: 'tx-exp-7',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries',
      amount: 95.80,
      currency: 'USD',
      transactionDate: getRelativeDate(5),
      description: 'Trader Joe’s Pantry Essentials',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(5),
    },
    {
      id: 'tx-exp-8',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries',
      amount: 38.40,
      currency: 'USD',
      transactionDate: getRelativeDate(2),
      description: 'Weekend Farmers Market Fruit',
      paymentMethod: 'Cash',
      type: 'EXPENSE',
      createdAt: getRelativeDate(2),
    },

    // Dining & Cafes
    {
      id: 'tx-exp-9',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 8.50,
      currency: 'USD',
      transactionDate: getRelativeDate(25),
      description: 'Blue Bottle Pour-over & Pastry',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(25),
    },
    {
      id: 'tx-exp-10',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 18.20,
      currency: 'USD',
      transactionDate: getRelativeDate(22),
      description: 'Chipotle Burrito Bowl lunch',
      paymentMethod: 'Debit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(22),
    },
    {
      id: 'tx-exp-11',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 94.00,
      currency: 'USD',
      transactionDate: getRelativeDate(18),
      description: 'Sushi Omakase with Marcus',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(18),
    },
    {
      id: 'tx-exp-12',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 7.25,
      currency: 'USD',
      transactionDate: getRelativeDate(15),
      description: 'Starbucks Nitro Cold Brew',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(15),
    },
    {
      id: 'tx-exp-13',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 52.00,
      currency: 'USD',
      transactionDate: getRelativeDate(10),
      description: 'Trattoria Bella Pasta Dinner',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(10),
    },
    {
      id: 'tx-exp-14',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 14.50,
      currency: 'USD',
      transactionDate: getRelativeDate(4),
      description: 'Sweetgreen Warm Bowl',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(4),
    },
    {
      id: 'tx-exp-15',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Cafes',
      amount: 8.75,
      currency: 'USD',
      transactionDate: getRelativeDate(1),
      description: 'Matcha Latte & Cookie',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(1),
    },

    // Transportation
    {
      id: 'tx-exp-16',
      categoryId: 'cat-transport',
      categoryName: 'Transportation',
      amount: 52.00,
      currency: 'USD',
      transactionDate: getRelativeDate(23),
      description: 'Shell Gas Station Fill-up',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(23),
    },
    {
      id: 'tx-exp-17',
      categoryId: 'cat-transport',
      categoryName: 'Transportation',
      amount: 34.00,
      currency: 'USD',
      transactionDate: getRelativeDate(17),
      description: 'Monthly Subway MetroCard Reload',
      paymentMethod: 'Debit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(17),
    },
    {
      id: 'tx-exp-18',
      categoryId: 'cat-transport',
      categoryName: 'Transportation',
      amount: 28.50,
      currency: 'USD',
      transactionDate: getRelativeDate(8),
      description: 'Uber Ride Downtown to Dinner',
      paymentMethod: 'Uber Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(8),
    },
    {
      id: 'tx-exp-19',
      categoryId: 'cat-transport',
      categoryName: 'Transportation',
      amount: 48.00,
      currency: 'USD',
      transactionDate: getRelativeDate(3),
      description: 'Shell Gas Station Fill-up',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(3),
    },

    // Entertainment & Subscriptions
    {
      id: 'tx-exp-20',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & Subs',
      amount: 19.99,
      currency: 'USD',
      transactionDate: getRelativeDate(20),
      description: 'Netflix 4K Ultra HD Subscription',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(20),
    },
    {
      id: 'tx-exp-21',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & Subs',
      amount: 11.99,
      currency: 'USD',
      transactionDate: getRelativeDate(16),
      description: 'Spotify Premium Family',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(16),
    },
    {
      id: 'tx-exp-22',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & Subs',
      amount: 36.00,
      currency: 'USD',
      transactionDate: getRelativeDate(9),
      description: 'IMAX Movie Tickets (Dune Pt 2)',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(9),
    },
    {
      id: 'tx-exp-23',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & Subs',
      amount: 20.00,
      currency: 'USD',
      transactionDate: getRelativeDate(7),
      description: 'Claude AI Developer Pro Plan',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(7),
    },

    // Health & Wellness
    {
      id: 'tx-exp-24',
      categoryId: 'cat-health',
      categoryName: 'Health & Wellness',
      amount: 65.00,
      currency: 'USD',
      transactionDate: getRelativeDate(24),
      description: 'Equinox Gym Monthly Access',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(24),
    },
    {
      id: 'tx-exp-25',
      categoryId: 'cat-health',
      categoryName: 'Health & Wellness',
      amount: 24.50,
      currency: 'USD',
      transactionDate: getRelativeDate(13),
      description: 'CVS Pharmacy Vitamins & Supplies',
      paymentMethod: 'Debit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(13),
    },

    // Shopping
    {
      id: 'tx-exp-26',
      categoryId: 'cat-shopping',
      categoryName: 'Shopping & Gear',
      amount: 89.00,
      currency: 'USD',
      transactionDate: getRelativeDate(21),
      description: 'Uniqlo Autumn Merino Sweater',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(21),
    },
    {
      id: 'tx-exp-27',
      categoryId: 'cat-shopping',
      categoryName: 'Shopping & Gear',
      amount: 45.00,
      currency: 'USD',
      transactionDate: getRelativeDate(11),
      description: 'Amazon Anker Ergonomic Mouse',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(11),
    },
    {
      id: 'tx-exp-28',
      categoryId: 'cat-shopping',
      categoryName: 'Shopping & Gear',
      amount: 62.50,
      currency: 'USD',
      transactionDate: getRelativeDate(6),
      description: 'Bookstore Hardcovers & Journal',
      paymentMethod: 'Apple Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(6),
    },
  ];

  const pods: Pod[] = [
    {
      id: 'pod-apt4b',
      name: 'Apartment 4B Roommates',
      createdAt: getRelativeDate(45),
      members: [
        { userId: 'demo-user-id', email: 'demo@finflow.com', firstName: 'Alex', lastName: 'Rivera' },
        { userId: 'user-m1', email: 'marcus.v@example.com', firstName: 'Marcus', lastName: 'Vance' },
        { userId: 'user-m2', email: 'elena.r@example.com', firstName: 'Elena', lastName: 'Rostova' },
      ],
      totalExpense: 1638.39,
    },
    {
      id: 'pod-tahoe',
      name: 'Lake Tahoe Weekend Trip',
      createdAt: getRelativeDate(18),
      members: [
        { userId: 'demo-user-id', email: 'demo@finflow.com', firstName: 'Alex', lastName: 'Rivera' },
        { userId: 'user-m3', email: 'sam.w@example.com', firstName: 'Sam', lastName: 'Wilson' },
        { userId: 'user-m4', email: 'chloe.k@example.com', firstName: 'Chloe', lastName: 'Kim' },
      ],
      totalExpense: 485.00,
    },
  ];

  const rules: RecurringRule[] = [
    {
      id: 'rule-rent',
      transactionId: 'tx-exp-1',
      description: 'Monthly Apartment Rent (Apt 4B)',
      amount: 1450.00,
      categoryName: 'Housing & Rent',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-4), // in 4 days
      lastRunDate: getRelativeDate(27),
    },
    {
      id: 'rule-netflix',
      transactionId: 'tx-exp-20',
      description: 'Netflix 4K Ultra HD Subscription',
      amount: 19.99,
      categoryName: 'Entertainment & Subs',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-11),
      lastRunDate: getRelativeDate(20),
    },
    {
      id: 'rule-gym',
      transactionId: 'tx-exp-24',
      description: 'Equinox Gym Monthly Access',
      amount: 65.00,
      categoryName: 'Health & Wellness',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-7),
      lastRunDate: getRelativeDate(24),
    },
  ];

  const budgets: Budget[] = [
    { id: 'b-groceries', categoryId: 'cat-groceries', categoryName: 'Groceries', monthlyLimit: 450.00, period: '2026-09' },
    { id: 'b-dining', categoryId: 'cat-dining', categoryName: 'Dining & Cafes', monthlyLimit: 250.00, period: '2026-09' },
    { id: 'b-transport', categoryId: 'cat-transport', categoryName: 'Transportation', monthlyLimit: 180.00, period: '2026-09' },
    { id: 'b-shopping', categoryId: 'cat-shopping', categoryName: 'Shopping & Gear', monthlyLimit: 220.00, period: '2026-09' },
    { id: 'b-entertainment', categoryId: 'cat-entertainment', categoryName: 'Entertainment & Subs', monthlyLimit: 120.00, period: '2026-09' },
  ];

  return { transactions, categories, pods, rules, budgets };
}

// Local Storage Manager Class
class StorageEngine {
  private getStorageKey(userId: string, entity: string): string {
    return `finflow_v1_${userId}_${entity}`;
  }

  public initializeUser(userId: string, isDemo: boolean = false) {
    const initializedKey = `finflow_v1_${userId}_initialized`;
    if (localStorage.getItem(initializedKey)) return;

    if (isDemo) {
      const demoData = generateSyntheticOneMonthData();
      localStorage.setItem(this.getStorageKey(userId, 'transactions'), JSON.stringify(demoData.transactions));
      localStorage.setItem(this.getStorageKey(userId, 'categories'), JSON.stringify(demoData.categories));
      localStorage.setItem(this.getStorageKey(userId, 'pods'), JSON.stringify(demoData.pods));
      localStorage.setItem(this.getStorageKey(userId, 'rules'), JSON.stringify(demoData.rules));
      localStorage.setItem(this.getStorageKey(userId, 'budgets'), JSON.stringify(demoData.budgets));
    } else {
      // Fresh user starts with standard categories and empty collections
      localStorage.setItem(this.getStorageKey(userId, 'transactions'), JSON.stringify([]));
      localStorage.setItem(this.getStorageKey(userId, 'categories'), JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem(this.getStorageKey(userId, 'pods'), JSON.stringify([]));
      localStorage.setItem(this.getStorageKey(userId, 'rules'), JSON.stringify([]));
      localStorage.setItem(this.getStorageKey(userId, 'budgets'), JSON.stringify([]));
    }
    localStorage.setItem(initializedKey, 'true');
  }

  public resetDemoData() {
    const demoId = DEMO_USER.id;
    const demoData = generateSyntheticOneMonthData();
    localStorage.setItem(this.getStorageKey(demoId, 'transactions'), JSON.stringify(demoData.transactions));
    localStorage.setItem(this.getStorageKey(demoId, 'categories'), JSON.stringify(demoData.categories));
    localStorage.setItem(this.getStorageKey(demoId, 'pods'), JSON.stringify(demoData.pods));
    localStorage.setItem(this.getStorageKey(demoId, 'rules'), JSON.stringify(demoData.rules));
    localStorage.setItem(this.getStorageKey(demoId, 'budgets'), JSON.stringify(demoData.budgets));
    localStorage.setItem(`finflow_v1_${demoId}_initialized`, 'true');
  }

  // Transactions
  public getTransactions(userId: string, params?: { keyword?: string; categoryId?: string; startDate?: string; endDate?: string; page?: number; size?: number }) {
    this.initializeUser(userId, userId === DEMO_USER.id);
    const raw = localStorage.getItem(this.getStorageKey(userId, 'transactions'));
    let list: Transaction[] = raw ? JSON.parse(raw) : [];

    // Sort by transactionDate descending
    list.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

    if (params) {
      if (params.keyword && params.keyword.trim()) {
        const q = params.keyword.toLowerCase().trim();
        list = list.filter(t => t.description.toLowerCase().includes(q) || t.categoryName.toLowerCase().includes(q));
      }
      if (params.categoryId && params.categoryId.trim()) {
        list = list.filter(t => t.categoryId === params.categoryId);
      }
      if (params.startDate) {
        list = list.filter(t => t.transactionDate >= params.startDate!);
      }
      if (params.endDate) {
        list = list.filter(t => t.transactionDate <= params.endDate!);
      }

      const size = params.size || 10;
      const page = params.page || 0;
      const totalElements = list.length;
      const totalPages = Math.max(1, Math.ceil(totalElements / size));
      const paginatedContent = list.slice(page * size, (page + 1) * size);

      return {
        content: paginatedContent,
        totalPages,
        totalElements,
        number: page,
      };
    }

    return list;
  }

  public addTransaction(userId: string, txData: Partial<Transaction>): Transaction {
    this.initializeUser(userId, userId === DEMO_USER.id);
    const raw = localStorage.getItem(this.getStorageKey(userId, 'transactions'));
    const list: Transaction[] = raw ? JSON.parse(raw) : [];
    const categories = this.getCategories(userId);
    const category = categories.find(c => c.id === txData.categoryId);

    const newTx: Transaction = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      categoryId: txData.categoryId || 'cat-general',
      categoryName: category?.name || txData.categoryName || 'General',
      amount: Number(txData.amount) || 0,
      currency: txData.currency || 'USD',
      transactionDate: txData.transactionDate || new Date().toISOString().split('T')[0],
      description: txData.description || 'Expense',
      paymentMethod: txData.paymentMethod || 'Manual',
      type: txData.type || 'EXPENSE',
      receiptUrl: txData.receiptUrl || null,
      createdAt: new Date().toISOString(),
      podId: txData.podId,
    };

    list.unshift(newTx);
    localStorage.setItem(this.getStorageKey(userId, 'transactions'), JSON.stringify(list));
    return newTx;
  }

  public deleteTransaction(userId: string, id: string): boolean {
    const raw = localStorage.getItem(this.getStorageKey(userId, 'transactions'));
    if (!raw) return false;
    let list: Transaction[] = JSON.parse(raw);
    list = list.filter(t => t.id !== id);
    localStorage.setItem(this.getStorageKey(userId, 'transactions'), JSON.stringify(list));
    return true;
  }

  // Categories
  public getCategories(userId: string): Category[] {
    this.initializeUser(userId, userId === DEMO_USER.id);
    const raw = localStorage.getItem(this.getStorageKey(userId, 'categories'));
    return raw ? JSON.parse(raw) : DEFAULT_CATEGORIES;
  }

  public addCategory(userId: string, catData: Partial<Category>): Category {
    const list = this.getCategories(userId);
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      name: catData.name || 'New Category',
      icon: catData.icon || '📁',
      color: catData.color || '#3b82f6',
      isCustom: true,
    };
    list.push(newCat);
    localStorage.setItem(this.getStorageKey(userId, 'categories'), JSON.stringify(list));
    return newCat;
  }

  // Pods
  public getPods(userId: string): Pod[] {
    this.initializeUser(userId, userId === DEMO_USER.id);
    const raw = localStorage.getItem(this.getStorageKey(userId, 'pods'));
    return raw ? JSON.parse(raw) : [];
  }

  public createPod(userId: string, name: string): Pod {
    const pods = this.getPods(userId);
    const user = userId === DEMO_USER.id ? DEMO_USER : (userId === FRESH_USER.id ? FRESH_USER : {
      id: userId,
      email: 'user@finflow.com',
      firstName: 'You',
      lastName: '',
      currency: 'USD',
    });

    const newPod: Pod = {
      id: 'pod-' + Date.now(),
      name: name.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      members: [
        {
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      ],
      totalExpense: 0,
    };
    pods.unshift(newPod);
    localStorage.setItem(this.getStorageKey(userId, 'pods'), JSON.stringify(pods));
    return newPod;
  }

  public inviteMember(userId: string, podId: string, email: string): Pod | null {
    const pods = this.getPods(userId);
    const pod = pods.find(p => p.id === podId);
    if (!pod) return null;
    const namePart = email.split('@')[0];
    pod.members.push({
      userId: 'user-' + Date.now(),
      email,
      firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      lastName: '',
      pendingEmail: email,
    });
    localStorage.setItem(this.getStorageKey(userId, 'pods'), JSON.stringify(pods));
    return pod;
  }

  // Recurring Rules
  public getRules(userId: string): RecurringRule[] {
    this.initializeUser(userId, userId === DEMO_USER.id);
    const raw = localStorage.getItem(this.getStorageKey(userId, 'rules'));
    return raw ? JSON.parse(raw) : [];
  }

  public createRule(userId: string, data: { transactionId: string; frequency: 'WEEKLY' | 'MONTHLY' | 'YEARLY'; nextDueDate: string }): RecurringRule {
    const rules = this.getRules(userId);
    const txs = this.getTransactions(userId) as Transaction[];
    const tx = Array.isArray(txs) ? txs.find(t => t.id === data.transactionId) : undefined;

    const newRule: RecurringRule = {
      id: 'rule-' + Date.now(),
      transactionId: data.transactionId,
      description: tx?.description || 'Recurring Payment',
      amount: tx?.amount || 0,
      categoryName: tx?.categoryName || 'Recurring',
      frequency: data.frequency,
      nextDueDate: data.nextDueDate,
      lastRunDate: null,
    };
    rules.unshift(newRule);
    localStorage.setItem(this.getStorageKey(userId, 'rules'), JSON.stringify(rules));
    return newRule;
  }

  public deleteRule(userId: string, id: string): boolean {
    let rules = this.getRules(userId);
    rules = rules.filter(r => r.id !== id);
    localStorage.setItem(this.getStorageKey(userId, 'rules'), JSON.stringify(rules));
    return true;
  }

  // Budgets
  public getBudgets(userId: string): Budget[] {
    this.initializeUser(userId, userId === DEMO_USER.id);
    const raw = localStorage.getItem(this.getStorageKey(userId, 'budgets'));
    return raw ? JSON.parse(raw) : [];
  }

  public saveBudget(userId: string, budgetData: { categoryId: string; monthlyLimit: number }): Budget {
    const budgets = this.getBudgets(userId);
    const categories = this.getCategories(userId);
    const cat = categories.find(c => c.id === budgetData.categoryId);

    const existingIndex = budgets.findIndex(b => b.categoryId === budgetData.categoryId);
    const currentPeriod = new Date().toISOString().substring(0, 7);

    const budgetItem: Budget = {
      id: existingIndex >= 0 ? budgets[existingIndex].id : 'b-' + Date.now(),
      categoryId: budgetData.categoryId,
      categoryName: cat?.name || 'Category',
      monthlyLimit: Number(budgetData.monthlyLimit),
      period: currentPeriod,
    };

    if (existingIndex >= 0) {
      budgets[existingIndex] = budgetItem;
    } else {
      budgets.push(budgetItem);
    }

    localStorage.setItem(this.getStorageKey(userId, 'budgets'), JSON.stringify(budgets));
    return budgetItem;
  }

  public deleteBudget(userId: string, id: string): boolean {
    let budgets = this.getBudgets(userId);
    budgets = budgets.filter(b => b.id !== id);
    localStorage.setItem(this.getStorageKey(userId, 'budgets'), JSON.stringify(budgets));
    return true;
  }
}

export const storageEngine = new StorageEngine();
