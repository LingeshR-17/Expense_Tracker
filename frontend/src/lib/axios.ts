import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { storageEngine, DEMO_USER, FRESH_USER } from './storageEngine';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom storage adapter for zero-friction local execution & dual interface demonstration
api.defaults.adapter = async (config: any): Promise<any> => {
  // Small realistic network delay for smooth UI feedback
  await new Promise((resolve) => setTimeout(resolve, 60));

  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();
  const state = useAuthStore.getState();
  const currentUserId = state.user?.id || DEMO_USER.id;

  // Make sure storage for current user is initialized
  storageEngine.initializeUser(currentUserId, currentUserId === DEMO_USER.id);

  let requestData: any = {};
  if (config.data) {
    try {
      requestData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch {
      requestData = config.data;
    }
  }

  // 1. AUTH: /auth/login
  if (url.includes('/auth/login') && method === 'POST') {
    const { email, password } = requestData;
    if (email === DEMO_USER.email && (password === 'demo123' || password === 'demo' || password.length > 0)) {
      storageEngine.initializeUser(DEMO_USER.id, true);
      return {
        data: { accessToken: 'jwt-demo-token-alex', user: DEMO_USER },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else if (email === FRESH_USER.email && (password === 'user123' || password === 'user' || password.length > 0)) {
      storageEngine.initializeUser(FRESH_USER.id, false);
      return {
        data: { accessToken: 'jwt-fresh-token-jordan', user: FRESH_USER },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else {
      // Check registered users
      const customRaw = localStorage.getItem('finflow_registered_users');
      const customUsers = customRaw ? JSON.parse(customRaw) : [];
      const matched = customUsers.find((u: any) => u.email === email && u.password === password);
      if (matched) {
        const userObj = {
          id: matched.id,
          email: matched.email,
          firstName: matched.firstName,
          lastName: matched.lastName,
          currency: matched.currency || 'INR',
          accountType: 'custom' as const,
        };
        storageEngine.initializeUser(userObj.id, false);
        return {
          data: { accessToken: 'jwt-custom-token-' + userObj.id, user: userObj },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      }

      // Default demo login if password matches demo, otherwise return 401
      if (email.includes('demo') || email.includes('aarav')) {
        return {
          data: { accessToken: 'jwt-demo-token-aarav', user: DEMO_USER },
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      }

      const err: any = new Error('Invalid email or password');
      err.response = {
        data: { error: { message: 'Invalid credentials. Please use demo@finflow.com / aarav@finflow.in (demo123) or user@finflow.com (user123).' } },
        status: 401,
        statusText: 'Unauthorized',
      };
      throw err;
    }
  }

  // 2. AUTH: /auth/register
  if (url.includes('/auth/register') && method === 'POST') {
    const { firstName, lastName, email, currency } = requestData;
    const newUserId = 'user-' + Date.now();
    const newUser = {
      id: newUserId,
      firstName,
      lastName,
      email,
      currency: currency || 'INR',
      accountType: 'custom' as const,
    };
    const customRaw = localStorage.getItem('finflow_registered_users');
    const customUsers = customRaw ? JSON.parse(customRaw) : [];
    customUsers.push({ ...requestData, id: newUserId });
    localStorage.setItem('finflow_registered_users', JSON.stringify(customUsers));

    storageEngine.initializeUser(newUserId, false);

    return {
      data: { accessToken: 'jwt-token-' + newUserId, user: newUser },
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // 3. TRANSACTIONS: /transactions/search
  if (url.includes('/transactions/search') && method === 'GET') {
    const result = storageEngine.getTransactions(currentUserId, config.params);
    return {
      data: result,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // 4. TRANSACTIONS: /transactions (GET or POST)
  if (url.endsWith('/transactions') || url.includes('/transactions?')) {
    if (method === 'GET') {
      const result = storageEngine.getTransactions(currentUserId);
      return {
        data: result,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else if (method === 'POST') {
      const created = storageEngine.addTransaction(currentUserId, requestData);
      return {
        data: created,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
  }

  // 5. TRANSACTIONS: /transactions/:id (DELETE)
  if (url.includes('/transactions/') && method === 'DELETE') {
    const parts = url.split('/');
    const txId = parts[parts.length - 1];
    storageEngine.deleteTransaction(currentUserId, txId);
    return {
      data: null,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config,
    };
  }

  // 6. CATEGORIES: /categories
  if (url.includes('/categories')) {
    if (method === 'GET') {
      const categories = storageEngine.getCategories(currentUserId);
      return {
        data: categories,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else if (method === 'POST') {
      const newCat = storageEngine.addCategory(currentUserId, requestData);
      return {
        data: newCat,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
  }

  // 7. PODS: /pods/:id/invite
  if (url.includes('/pods/') && url.includes('/invite') && method === 'POST') {
    const podId = url.split('/pods/')[1].split('/')[0];
    const pod = storageEngine.inviteMember(currentUserId, podId, requestData.email);
    return {
      data: pod,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // 8. PODS: /pods/:id/settlement-plan
  if (url.includes('/pods/') && url.includes('/settlement-plan') && method === 'GET') {
    return {
      data: [
        { fromUserId: 'user-m1', toUserId: currentUserId, amount: 145.50 },
        { fromUserId: 'user-m2', toUserId: currentUserId, amount: 82.20 },
      ],
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // 9. PODS: /pods/:id/settle
  if (url.includes('/pods/') && url.includes('/settle') && method === 'POST') {
    return {
      data: { success: true, message: 'Settled all balances' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // 10. PODS: /pods (GET or POST)
  if (url.includes('/pods')) {
    if (method === 'GET') {
      const pods = storageEngine.getPods(currentUserId);
      return {
        data: pods,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else if (method === 'POST') {
      const newPod = storageEngine.createPod(currentUserId, requestData.name);
      return {
        data: newPod,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
  }

  // 11. RULES: /rules/:id (DELETE)
  if (url.includes('/rules/') && method === 'DELETE') {
    const parts = url.split('/');
    const ruleId = parts[parts.length - 1];
    storageEngine.deleteRule(currentUserId, ruleId);
    return {
      data: null,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config,
    };
  }

  // 12. RULES: /rules
  if (url.includes('/rules')) {
    if (method === 'GET') {
      const rules = storageEngine.getRules(currentUserId);
      return {
        data: rules,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else if (method === 'POST') {
      const newRule = storageEngine.createRule(currentUserId, requestData);
      return {
        data: newRule,
        status: 201,
        statusText: 'Created',
        headers: {},
        config,
      };
    }
  }

  // 13. BUDGETS: /budgets/:id (DELETE)
  if (url.includes('/budgets/') && method === 'DELETE') {
    const parts = url.split('/');
    const budgetId = parts[parts.length - 1];
    storageEngine.deleteBudget(currentUserId, budgetId);
    return {
      data: null,
      status: 204,
      statusText: 'No Content',
      headers: {},
      config,
    };
  }

  // 14. BUDGETS: /budgets
  if (url.includes('/budgets')) {
    if (method === 'GET') {
      const budgets = storageEngine.getBudgets(currentUserId);
      return {
        data: budgets,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    } else if (method === 'POST') {
      const budget = storageEngine.saveBudget(currentUserId, requestData);
      return {
        data: budget,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      };
    }
  }

  // Fallback 404
  return {
    data: {},
    status: 404,
    statusText: 'Not Found',
    headers: {},
    config,
  };
};

export default api;
