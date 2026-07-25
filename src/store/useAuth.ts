import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccentColor } from '../types';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  plan: 'free' | 'pro';
  accentColor: AccentColor;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  
  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  updateAvatar: (avatarUrl: string) => void;
  updatePassword: (oldPass: string, newPass: string) => Promise<boolean>;
  upgradePlan: () => void;
  cancelSubscription: () => void;
  setAccentColor: (color: AccentColor) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isInitialized: false,

      login: async (email, password) => {
        // Mock API Call delay
        await new Promise((resolve) => setTimeout(resolve, 900));
        
        // Mock validation
        if (email && password) {
          set({
            user: {
              id: 'u1',
              email,
              name: 'Ava Sinclair',
              avatar: 'https://i.pravatar.cc/150?u=ava',
              plan: 'free',
              accentColor: 'emerald'
            },
            isAuthenticated: true,
            isInitialized: true
          });
          
          // Apply theme color
          document.documentElement.style.setProperty('--primary', `var(--color-emerald-600)`);
          return true;
        }
        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (name, email) => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, name, email } };
      }),

      updateAvatar: (avatar) => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, avatar } };
      }),

      updatePassword: async (oldPass, _newPass) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Accept any password for the mock demo as long as it's provided
        if (oldPass && oldPass.length > 0) {
          return true;
        }
        return false;
      },

      upgradePlan: () => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, plan: 'pro' } };
      }),

      cancelSubscription: () => set((state) => {
        if (!state.user) return state;
        return { user: { ...state.user, plan: 'free' } };
      }),

      setAccentColor: (color) => {
        set((state) => {
          if (!state.user) return state;
          return { user: { ...state.user, accentColor: color } };
        });
        
        const colorMap: Record<AccentColor, string> = {
          emerald: '#059669',
          indigo: '#4F46E5',
          violet: '#7C3AED',
          amber: '#D97706'
        };
        document.documentElement.style.setProperty('--primary', colorMap[color]);
      }
    }),
    {
      name: 'masar-auth-storage',
    }
  )
);
