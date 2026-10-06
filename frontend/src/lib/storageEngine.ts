import type { User, Transaction, Category, Pod, RecurringRule, Budget } from '../types';

export const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'aarav@finflow.in',
  firstName: 'Aarav',
  lastName: 'Sharma',
  currency: 'INR',
  accountType: 'demo',
};

export const FRESH_USER: User = {
  id: 'fresh-user-id',
  email: 'priya@finflow.in',
  firstName: 'Priya',
  lastName: 'Patel',
  currency: 'INR',
  accountType: 'fresh',
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-housing', name: 'Housing & Rent', icon: '🏠', color: '#3b82f6', isCustom: false },
  { id: 'cat-groceries', name: 'Groceries & Kirana', icon: '🛒', color: '#10b981', isCustom: false },
  { id: 'cat-dining', name: 'Dining & Food Delivery', icon: '☕', color: '#f59e0b', isCustom: false },
  { id: 'cat-transport', name: 'Commute & Travel', icon: '🚗', color: '#6366f1', isCustom: false },
  { id: 'cat-entertainment', name: 'Entertainment & OTT', icon: '🎬', color: '#ec4899', isCustom: false },
  { id: 'cat-utilities', name: 'Utilities & Bills', icon: '⚡', color: '#06b6d4', isCustom: false },
  { id: 'cat-shopping', name: 'Shopping & Apparel', icon: '🛍️', color: '#8b5cf6', isCustom: false },
  { id: 'cat-health', name: 'Healthcare & Wellness', icon: '💊', color: '#14b8a6', isCustom: false },
  { id: 'cat-income', name: 'Salary & Investments', icon: '💰', color: '#22c55e', isCustom: false },
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
      categoryName: 'Salary & Investments',
      amount: 95000.00,
      currency: 'INR',
      transactionDate: getRelativeDate(28),
      description: 'TechCorp Software Engineer Monthly Salary',
      paymentMethod: 'NEFT Bank Transfer',
      type: 'INCOME',
      createdAt: getRelativeDate(28),
    },
    {
      id: 'tx-inc-2',
      categoryId: 'cat-income',
      categoryName: 'Salary & Investments',
      amount: 22500.00,
      currency: 'INR',
      transactionDate: getRelativeDate(20),
      description: 'Freelance UI/UX Web Dev Milestone',
      paymentMethod: 'UPI / Razorpay',
      type: 'INCOME',
      createdAt: getRelativeDate(20),
    },
    {
      id: 'tx-inc-3',
      categoryId: 'cat-income',
      categoryName: 'Salary & Investments',
      amount: 4500.00,
      currency: 'INR',
      transactionDate: getRelativeDate(14),
      description: 'Nifty Index Fund Quarterly Dividend',
      paymentMethod: 'Direct Deposit',
      type: 'INCOME',
      createdAt: getRelativeDate(14),
    },

    // Housing & Utilities
    {
      id: 'tx-exp-1',
      categoryId: 'cat-housing',
      categoryName: 'Housing & Rent',
      amount: 24000.00,
      currency: 'INR',
      transactionDate: getRelativeDate(27),
      description: 'Monthly Apartment Rent (2BHK Koramangala)',
      paymentMethod: 'UPI Transfer',
      type: 'EXPENSE',
      createdAt: getRelativeDate(27),
    },
    {
      id: 'tx-exp-2',
      categoryId: 'cat-utilities',
      categoryName: 'Utilities & Bills',
      amount: 2350.00,
      currency: 'INR',
      transactionDate: getRelativeDate(25),
      description: 'BESCOM Electricity Bill',
      paymentMethod: 'Google Pay UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(25),
    },
    {
      id: 'tx-exp-3',
      categoryId: 'cat-utilities',
      categoryName: 'Utilities & Bills',
      amount: 999.00,
      currency: 'INR',
      transactionDate: getRelativeDate(24),
      description: 'JioFiber 100 Mbps Unlimited Broadband',
      paymentMethod: 'Auto-Debit UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(24),
    },
    {
      id: 'tx-exp-3b',
      categoryId: 'cat-utilities',
      categoryName: 'Utilities & Bills',
      amount: 1105.00,
      currency: 'INR',
      transactionDate: getRelativeDate(18),
      description: 'Indane LPG Gas Cylinder Refill',
      paymentMethod: 'PhonePe UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(18),
    },

    // Groceries & Kirana (spread across month)
    {
      id: 'tx-exp-4',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries & Kirana',
      amount: 1480.00,
      currency: 'INR',
      transactionDate: getRelativeDate(26),
      description: 'Blinkit Instant Groceries & Dairy',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(26),
    },
    {
      id: 'tx-exp-5',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries & Kirana',
      amount: 4850.00,
      currency: 'INR',
      transactionDate: getRelativeDate(19),
      description: 'DMart Monthly Staples Haul',
      paymentMethod: 'Debit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(19),
    },
    {
      id: 'tx-exp-6',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries & Kirana',
      amount: 820.00,
      currency: 'INR',
      transactionDate: getRelativeDate(12),
      description: 'Zepto Fresh Fruits & Vegetables',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(12),
    },
    {
      id: 'tx-exp-7',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries & Kirana',
      amount: 2450.00,
      currency: 'INR',
      transactionDate: getRelativeDate(5),
      description: 'BigBasket Organic Atta, Rice & Spices',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(5),
    },
    {
      id: 'tx-exp-8',
      categoryId: 'cat-groceries',
      categoryName: 'Groceries & Kirana',
      amount: 540.00,
      currency: 'INR',
      transactionDate: getRelativeDate(2),
      description: 'Local Kirana Store Milk & Bread',
      paymentMethod: 'Cash',
      type: 'EXPENSE',
      createdAt: getRelativeDate(2),
    },

    // Dining & Food Delivery
    {
      id: 'tx-exp-9',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 180.00,
      currency: 'INR',
      transactionDate: getRelativeDate(25),
      description: 'Chai Point Ginger Chai & Bun Maska',
      paymentMethod: 'Paytm UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(25),
    },
    {
      id: 'tx-exp-10',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 420.00,
      currency: 'INR',
      transactionDate: getRelativeDate(22),
      description: 'Haldiram’s Chole Bhature & Lassi',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(22),
    },
    {
      id: 'tx-exp-11',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 2850.00,
      currency: 'INR',
      transactionDate: getRelativeDate(18),
      description: 'Barbeque Nation Dinner with Colleagues',
      paymentMethod: 'HDFC Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(18),
    },
    {
      id: 'tx-exp-12',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 320.00,
      currency: 'INR',
      transactionDate: getRelativeDate(15),
      description: 'Third Wave Coffee Classic Cold Brew',
      paymentMethod: 'Google Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(15),
    },
    {
      id: 'tx-exp-13',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 890.00,
      currency: 'INR',
      transactionDate: getRelativeDate(10),
      description: 'Swiggy Meghana Foods Special Biryani',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(10),
    },
    {
      id: 'tx-exp-14',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 1250.00,
      currency: 'INR',
      transactionDate: getRelativeDate(4),
      description: 'Zomato Truffles Burger & Pasta Feast',
      paymentMethod: 'ICICI Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(4),
    },
    {
      id: 'tx-exp-15',
      categoryId: 'cat-dining',
      categoryName: 'Dining & Food Delivery',
      amount: 160.00,
      currency: 'INR',
      transactionDate: getRelativeDate(1),
      description: 'Filter Coffee & Ghee Podi Idli at Rameshwaram',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(1),
    },

    // Commute & Travel
    {
      id: 'tx-exp-16',
      categoryId: 'cat-transport',
      categoryName: 'Commute & Travel',
      amount: 2500.00,
      currency: 'INR',
      transactionDate: getRelativeDate(23),
      description: 'IndianOil Petrol Pump Tank Full',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(23),
    },
    {
      id: 'tx-exp-17',
      categoryId: 'cat-transport',
      categoryName: 'Commute & Travel',
      amount: 800.00,
      currency: 'INR',
      transactionDate: getRelativeDate(17),
      description: 'Metro Smart Card Auto-Recharge',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(17),
    },
    {
      id: 'tx-exp-18',
      categoryId: 'cat-transport',
      categoryName: 'Commute & Travel',
      amount: 185.00,
      currency: 'INR',
      transactionDate: getRelativeDate(8),
      description: 'Ola Auto Commute to Office Tech Park',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(8),
    },
    {
      id: 'tx-exp-19',
      categoryId: 'cat-transport',
      categoryName: 'Commute & Travel',
      amount: 1150.00,
      currency: 'INR',
      transactionDate: getRelativeDate(3),
      description: 'Uber Premier Ride to Kempegowda Airport',
      paymentMethod: 'Uber Pay UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(3),
    },

    // Entertainment & OTT
    {
      id: 'tx-exp-20',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & OTT',
      amount: 649.00,
      currency: 'INR',
      transactionDate: getRelativeDate(20),
      description: 'Netflix India 4K Premium Plan',
      paymentMethod: 'Credit Card Auto-Debit',
      type: 'EXPENSE',
      createdAt: getRelativeDate(20),
    },
    {
      id: 'tx-exp-21',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & OTT',
      amount: 299.00,
      currency: 'INR',
      transactionDate: getRelativeDate(16),
      description: 'Disney+ Hotstar Super Plan',
      paymentMethod: 'UPI Auto-Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(16),
    },
    {
      id: 'tx-exp-22',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & OTT',
      amount: 1200.00,
      currency: 'INR',
      transactionDate: getRelativeDate(9),
      description: 'PVR INOX IMAX 3D Movie Tickets',
      paymentMethod: 'BookMyShow UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(9),
    },
    {
      id: 'tx-exp-23',
      categoryId: 'cat-entertainment',
      categoryName: 'Entertainment & OTT',
      amount: 119.00,
      currency: 'INR',
      transactionDate: getRelativeDate(7),
      description: 'Spotify India Individual Premium',
      paymentMethod: 'UPI Auto-Pay',
      type: 'EXPENSE',
      createdAt: getRelativeDate(7),
    },

    // Healthcare & Wellness
    {
      id: 'tx-exp-24',
      categoryId: 'cat-health',
      categoryName: 'Healthcare & Wellness',
      amount: 2499.00,
      currency: 'INR',
      transactionDate: getRelativeDate(24),
      description: 'Cult.fit Elite Monthly Gym Membership',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(24),
    },
    {
      id: 'tx-exp-25',
      categoryId: 'cat-health',
      categoryName: 'Healthcare & Wellness',
      amount: 780.00,
      currency: 'INR',
      transactionDate: getRelativeDate(13),
      description: 'Apollo Pharmacy Multivitamins & Skincare',
      paymentMethod: 'UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(13),
    },

    // Shopping & Apparel
    {
      id: 'tx-exp-26',
      categoryId: 'cat-shopping',
      categoryName: 'Shopping & Apparel',
      amount: 3499.00,
      currency: 'INR',
      transactionDate: getRelativeDate(21),
      description: 'Myntra Festive Collection Kurtas & Shirts',
      paymentMethod: 'Credit Card',
      type: 'EXPENSE',
      createdAt: getRelativeDate(21),
    },
    {
      id: 'tx-exp-27',
      categoryId: 'cat-shopping',
      categoryName: 'Shopping & Apparel',
      amount: 1999.00,
      currency: 'INR',
      transactionDate: getRelativeDate(11),
      description: 'Amazon India Wireless Ergonomic Keyboard',
      paymentMethod: 'Amazon Pay ICICI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(11),
    },
    {
      id: 'tx-exp-28',
      categoryId: 'cat-shopping',
      categoryName: 'Shopping & Apparel',
      amount: 850.00,
      currency: 'INR',
      transactionDate: getRelativeDate(6),
      description: 'Crossword Bookstore Paperback Novels',
      paymentMethod: 'Google Pay UPI',
      type: 'EXPENSE',
      createdAt: getRelativeDate(6),
    },
  ];

  const pods: Pod[] = [
    {
      id: 'pod-koramangala',
      name: 'Koramangala Flat 302',
      createdAt: getRelativeDate(45),
      members: [
        { userId: 'demo-user-id', email: 'aarav@finflow.in', firstName: 'Aarav', lastName: 'Sharma' },
        { userId: 'user-m1', email: 'rohan.v@example.in', firstName: 'Rohan', lastName: 'Verma' },
        { userId: 'user-m2', email: 'sneha.i@example.in', firstName: 'Sneha', lastName: 'Iyer' },
      ],
      totalExpense: 28450.00,
    },
    {
      id: 'pod-goa',
      name: 'Goa Weekend Trip 2026',
      createdAt: getRelativeDate(18),
      members: [
        { userId: 'demo-user-id', email: 'aarav@finflow.in', firstName: 'Aarav', lastName: 'Sharma' },
        { userId: 'user-m3', email: 'vikram.m@example.in', firstName: 'Vikram', lastName: 'Malhotra' },
        { userId: 'user-m4', email: 'ananya.s@example.in', firstName: 'Ananya', lastName: 'Sen' },
      ],
      totalExpense: 18200.00,
    },
  ];

  const rules: RecurringRule[] = [
    {
      id: 'rule-rent',
      transactionId: 'tx-exp-1',
      description: 'Monthly Apartment Rent (2BHK Koramangala)',
      amount: 24000.00,
      categoryName: 'Housing & Rent',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-4),
      lastRunDate: getRelativeDate(27),
    },
    {
      id: 'rule-netflix',
      transactionId: 'tx-exp-20',
      description: 'Netflix India 4K Premium Plan',
      amount: 649.00,
      categoryName: 'Entertainment & OTT',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-11),
      lastRunDate: getRelativeDate(20),
    },
    {
      id: 'rule-cultfit',
      transactionId: 'tx-exp-24',
      description: 'Cult.fit Elite Monthly Gym Membership',
      amount: 2499.00,
      categoryName: 'Healthcare & Wellness',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-7),
      lastRunDate: getRelativeDate(24),
    },
    {
      id: 'rule-jio',
      transactionId: 'tx-exp-3',
      description: 'JioFiber 100 Mbps Unlimited Broadband',
      amount: 999.00,
      categoryName: 'Utilities & Bills',
      frequency: 'MONTHLY',
      nextDueDate: getRelativeDate(-5),
      lastRunDate: getRelativeDate(24),
    },
  ];

  const budgets: Budget[] = [
    { id: 'b-groceries', categoryId: 'cat-groceries', categoryName: 'Groceries & Kirana', monthlyLimit: 12000.00, period: '2026-09' },
    { id: 'b-dining', categoryId: 'cat-dining', categoryName: 'Dining & Food Delivery', monthlyLimit: 8000.00, period: '2026-09' },
    { id: 'b-transport', categoryId: 'cat-transport', categoryName: 'Commute & Travel', monthlyLimit: 6000.00, period: '2026-09' },
    { id: 'b-shopping', categoryId: 'cat-shopping', categoryName: 'Shopping & Apparel', monthlyLimit: 8000.00, period: '2026-09' },
    { id: 'b-entertainment', categoryId: 'cat-entertainment', categoryName: 'Entertainment & OTT', monthlyLimit: 3000.00, period: '2026-09' },
    { id: 'b-utilities', categoryId: 'cat-utilities', categoryName: 'Utilities & Bills', monthlyLimit: 6000.00, period: '2026-09' },
  ];

  return { transactions, categories, pods, rules, budgets };
}

// Local Storage Manager Class (using finflow_v2 for Indian data baseline)
class StorageEngine {
  private getStorageKey(userId: string, entity: string): string {
    return `finflow_v2_${userId}_${entity}`;
  }

  public initializeUser(userId: string, isDemo: boolean = false) {
    const initializedKey = `finflow_v2_${userId}_initialized`;
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
    localStorage.setItem(`finflow_v2_${demoId}_initialized`, 'true');
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
      categoryId: txData.categoryId || 'cat-housing',
      categoryName: category?.name || txData.categoryName || 'General',
      amount: Number(txData.amount) || 0,
      currency: txData.currency || 'INR',
      transactionDate: txData.transactionDate || new Date().toISOString().split('T')[0],
      description: txData.description || 'Expense',
      paymentMethod: txData.paymentMethod || 'UPI',
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
      email: 'user@finflow.in',
      firstName: 'You',
      lastName: '',
      currency: 'INR',
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
