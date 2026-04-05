import { financeMockData } from '../data/financeMock';

// Simulate network latency
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Sync with localStorage for persistence simulation
const getStoredTransactions = () => {
  const stored = localStorage.getItem('finova-transactions');
  return stored ? JSON.parse(stored) : financeMockData;
};

const saveTransactions = (txs) => {
  localStorage.setItem('finova-transactions', JSON.stringify(txs));
};

export const api = {
  fetchTransactions: async () => {
    await delay();
    return getStoredTransactions();
  },

  addTransaction: async (tx) => {
    await delay(500);
    const txs = getStoredTransactions();
    const newTx = { ...tx, id: `tx_${Date.now()}` };
    const updated = [newTx, ...txs];
    saveTransactions(updated);
    return newTx;
  },

  updateTransaction: async (id, patch) => {
    await delay(400);
    const txs = getStoredTransactions();
    const updated = txs.map(tx => tx.id === id ? { ...tx, ...patch } : tx);
    saveTransactions(updated);
    return updated.find(tx => tx.id === id);
  },

  deleteTransaction: async (id) => {
    await delay(300);
    const txs = getStoredTransactions();
    const updated = txs.filter(tx => tx.id !== id);
    saveTransactions(updated);
    return true;
  }
};
