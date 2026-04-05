import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '../lib/api';

/**
 * Advanced Finance Store for Finova.
 * Features: Persistence (Transactions & Role), Mock API Integration, and Toast Notifications.
 */
export const useFinanceStore = create(
  persist(
    (set, get) => ({
      // State
      transactions: [],
      isLoading: false,
      role: 'admin', 
      toasts: [],
      savingsGoal: 2500,
      
      filters: { 
        search: '', 
        type: 'all', 
        categories: [], 
        dateRange: 'all', 
        sortBy: 'date', 
        sortDir: 'desc' 
      },

      // --- Initialization ---
      init: async () => {
        set({ isLoading: true });
        try {
          const txs = await api.fetchTransactions();
          set({ transactions: txs });
        } catch {
          get().addToast('Failed to load transactions', 'error');
        } finally {
          set({ isLoading: false });
        }
      },

      // --- Transaction Actions ---
      addTransaction: async (t) => {
        set({ isLoading: true });
        try {
          const newTx = await api.addTransaction(t);
          set((state) => ({ 
            transactions: [newTx, ...state.transactions] 
          }));
          get().addToast(`Transaction added: ${t.merchant}`, 'success');
        } catch {
          get().addToast('Failed to add transaction', 'error');
        } finally {
          set({ isLoading: false });
        }
      },

      updateTransaction: async (id, patch) => {
        set({ isLoading: true });
        try {
          const updated = await api.updateTransaction(id, patch);
          set((state) => ({
            transactions: state.transactions.map(tx => tx.id === id ? updated : tx)
          }));
          get().addToast('Transaction updated', 'info');
        } catch {
          get().addToast('Failed to update transaction', 'error');
        } finally {
          set({ isLoading: false });
        }
      },

      deleteTransaction: async (id) => {
        set({ isLoading: true });
        try {
          await api.deleteTransaction(id);
          set((state) => ({
            transactions: state.transactions.filter(tx => tx.id !== id)
          }));
          get().addToast('Transaction deleted', 'warning');
        } catch {
          get().addToast('Failed to delete transaction', 'error');
        } finally {
          set({ isLoading: false });
        }
      },

      setTransactions: (txs) => {
        set({ transactions: txs });
        get().addToast('Data imported successfully', 'success');
      },

      // --- Role Actions ---
      setRole: (r) => {
        set({ role: r });
        get().addToast(`Switched to ${r} mode`, 'info');
      },

      setSavingsGoal: (goal) => {
        set({ savingsGoal: goal });
        get().addToast('Savings goal updated', 'success');
      },

      // --- Filter Actions ---
      setFilter: (key, value) => {
        set((state) => ({ 
          filters: { ...state.filters, [key]: value } 
        }));
      },

      resetFilters: () => {
        set({ 
          filters: { 
            search: '', 
            type: 'all', 
            categories: [], 
            dateRange: 'all', 
            sortBy: 'date', 
            sortDir: 'desc' 
          } 
        });
      },

      // --- Toast Actions ---
      addToast: (message, type = 'info') => {
        const id = Date.now();
        set((state) => ({ 
          toasts: [...state.toasts, { id, message, type }] 
        }));
        // Auto-remove after 3 seconds
        setTimeout(() => get().removeToast(id), 3000);
      },

      removeToast: (id) => {
        set((state) => ({ 
          toasts: state.toasts.filter(t => t.id !== id) 
        }));
      },

      // --- Selectors/Heuristics ---
      getSummary: () => {
        const { transactions } = get();
        if (!transactions || transactions.length === 0) {
          return {
            totalBalance: 0,
            totalIncome: 0,
            totalExpenses: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            savingsRate: '0.0'
          };
        }
        
        // Calculate Global Totals (All transactions)
        const totalIncome = transactions.reduce((acc, tx) => tx.type === 'income' ? acc + (tx.amount || 0) : acc, 0);
        const totalExpenses = transactions.reduce((acc, tx) => tx.type === 'expense' ? acc + (tx.amount || 0) : acc, 0);
        const totalBalance = totalIncome - totalExpenses;
        
        // Calculate Monthly Totals (Most recent month present in data)
        const sortedTxsByDate = [...transactions].sort((a,b) => new Date(b.date) - new Date(a.date));
        const latestTx = sortedTxsByDate[0];
        const latestMonth = latestTx ? new Date(latestTx.date).getMonth() : new Date().getMonth();
        const latestYear = latestTx ? new Date(latestTx.date).getFullYear() : new Date().getFullYear();

        const monthTxs = transactions.filter(tx => {
          const d = new Date(tx.date);
          return d.getMonth() === latestMonth && d.getFullYear() === latestYear;
        });

        const monthlyIncome = monthTxs.reduce((acc, tx) => tx.type === 'income' ? acc + (tx.amount || 0) : acc, 0);
        const monthlyExpenses = monthTxs.reduce((acc, tx) => tx.type === 'expense' ? acc + (tx.amount || 0) : acc, 0);
        const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

        return {
          totalBalance,
          totalIncome,
          totalExpenses,
          monthlyIncome,
          monthlyExpenses,
          savingsRate: Math.max(0, savingsRate).toFixed(1)
        };
      }
    }),
    {
      name: 'finova-finance-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        role: state.role,
        transactions: state.transactions,
        savingsGoal: state.savingsGoal
      }),
    }
  )
);
