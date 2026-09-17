import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { DEMO_USER, FRESH_USER, storageEngine } from '../lib/storageEngine';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  switchAccount: (type: 'demo' | 'fresh') => void;
  updateCurrency: (currency: string) => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEMO_USER, // default to demo account for seamless first-time preview
      token: 'demo-initial-jwt-token',
      setAuth: (user, token) => {
        storageEngine.initializeUser(user.id, user.id === DEMO_USER.id);
        set({ user, token });
      },
      logout: () => set({ user: null, token: null }),
      switchAccount: (type: 'demo' | 'fresh') => {
        const targetUser = type === 'demo' ? DEMO_USER : FRESH_USER;
        const targetToken = type === 'demo' ? 'demo-jwt-token' : 'fresh-jwt-token';
        storageEngine.initializeUser(targetUser.id, type === 'demo');
        set({ user: targetUser, token: targetToken });
      },
      updateCurrency: (currency: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, currency } });
        }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
);
