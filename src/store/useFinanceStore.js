import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { financeMockData } from '../data/financeMock';

/**
 * Advanced Finance Store for Finova.
 * Features: Persistence (Transactions & Role), Filters (Non-persistent), and Toast Notifications.
 */
export const useFinanceStore = create(
  persist(
    (set, get) => ({
      // State
      transactions: financeMockData,
      role: 'admin', // default role
      toasts: [],
      
      filters: { 
        search: '', 
        type: 'all', 
        categories: [], 
        dateRange: 'all', 
        sortBy: 'date', 
        sortDir: 'desc' 
      },

      // --- Transaction Actions ---
      addTransaction: (t) => {
        const newTx = { ...t, id: `tx_${Date.now()}` };
        set((state) => ({ 
          transactions: [newTx, ...state.transactions] 
        }));
        get().addToast(`Transaction added: ${t.merchant}`, 'success');
      },

      updateTransaction: (id, patch) => {
        set((state) => ({
          transactions: state.transactions.map(tx => tx.id === id ? { ...tx, ...patch } : tx)
        }));
        get().addToast('Transaction updated', 'info');
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(tx => tx.id !== id)
        }));
        get().addToast('Transaction deleted', 'warning');
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
        
        // Calculate Global Totals (All transactions)
        const totalIncome = transactions.reduce((acc, tx) => tx.type === 'income' ? acc + tx.amount : acc, 0);
        const totalExpenses = transactions.reduce((acc, tx) => tx.type === 'expense' ? acc + tx.amount : acc, 0);
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

        const monthlyIncome = monthTxs.reduce((acc, tx) => tx.type === 'income' ? acc + tx.amount : acc, 0);
        const monthlyExpenses = monthTxs.reduce((acc, tx) => tx.type === 'expense' ? acc + tx.amount : acc, 0);
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
      name: 'zorvyn-finance-store',
      storage: createJSONStorage(() => localStorage),
      // Partialize: persist transactions and role only (not filters or toasts)
      partialize: (state) => ({ 
        transactions: state.transactions, 
        role: state.role 
      }),
    }
  )
);
