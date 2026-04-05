import React, { useState, useMemo } from 'react';
import { 
  Search, Filter, Plus, Edit2, Trash2, 
  ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight,
  ShieldAlert, RotateCcw, Upload
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { TransactionModal } from '../components/finance/TransactionModal';

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Salary', 'Dividend', 'Freelance'];

export const TransactionsPage = () => {
  const { 
    transactions, role, filters, setFilter, resetFilters, 
    addTransaction, updateTransaction, deleteTransaction, setTransactions, addToast 
  } = useFinanceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 15;

  const isAdmin = role === 'admin';

  // Apply filters and sorting
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter(tx => {
      const matchesSearch = tx.merchant.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'all' || tx.type === filters.type;
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(tx.category);
      return matchesSearch && matchesType && matchesCategory;
    });

    result.sort((a, b) => {
      const order = filters.sortDir === 'asc' ? 1 : -1;
      if (filters.sortBy === 'date') return (new Date(a.date) - new Date(b.date)) * order;
      if (filters.sortBy === 'amount') return (a.amount - b.amount) * order;
      if (filters.sortBy === 'merchant') return a.merchant.localeCompare(b.merchant) * order;
      return 0;
    });

    return result;
  }, [transactions, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedData = filteredTransactions.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleEdit = (tx) => {
    if (!isAdmin) return;
    setEditingTx(tx);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleModalSubmit = (data) => {
    if (editingTx) {
      updateTransaction(editingTx.id, data);
    } else {
      addTransaction(data);
    }
  };
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        let data = [];
        
        if (file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else {
          // Robust CSV parsing
          const lines = content.split(/\r?\n/).filter(line => line.trim());
          if (lines.length < 2) throw new Error('File is empty or missing headers');
          
          const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          
          // Map headers to internal keys
          const headerMap = rawHeaders.map(h => {
            const low = h.toLowerCase();
            if (low.includes('merchant') || low.includes('vendor') || low.includes('description') || low.includes('payee')) return 'merchant';
            if (low.includes('amount') || low.includes('value') || low.includes('price')) return 'amount';
            if (low.includes('date') || low.includes('time')) return 'date';
            if (low.includes('cat')) return 'category';
            if (low.includes('type')) return 'type';
            return low;
          });

          data = lines.slice(1).map(line => {
            // Split by comma but ignore commas inside quotes
            const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            const obj = {};
            headerMap.forEach((key, index) => {
              let val = values[index]?.trim().replace(/^"|"$/g, '') || '';
              
              if (key === 'amount') {
                // Remove currency symbols and format as number
                obj[key] = parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0;
              } else {
                obj[key] = val;
              }
            });
            return obj;
          });
        }
        
        if (Array.isArray(data) && data.length > 0) {
          // Normalize and assign defaults
          const processedData = data.map((tx, idx) => {
            const amount = parseFloat(tx.amount) || 0;
            return {
              id: tx.id || `imp_${Date.now()}_${idx}`,
              date: tx.date || new Date().toISOString(),
              merchant: tx.merchant || tx.Merchant || tx.Vendor || 'Unknown Merchant',
              category: tx.category || tx.Category || 'General',
              amount: Math.abs(amount),
              type: tx.type?.toLowerCase() || (amount >= 0 ? 'income' : 'expense')
            };
          });
          setTransactions(processedData);
          setCurrentPage(1); 
        } else {
          addToast('Invalid or empty data', 'warning');
        }
      } catch (err) {
        addToast('Error reading file: ' + err.message, 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Clear input
  };
  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-1 duration-300">
      
      {/* Read-Only Banner */}
      {!isAdmin && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 animate-in slide-in-from-top-4 duration-300">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm font-medium">
            <span className="font-bold">Read-Only Mode:</span> You are viewing the dashboard as a member. Switch to Admin mode in the sidebar to add or edit transactions.
          </p>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            History of your cash flow <span className="w-1 h-1 rounded-full bg-slate-300" /> {filteredTransactions.length} total entries
          </p>
        </div>
        
        {isAdmin && (
          <div className="flex items-center gap-3">
            <div className="relative group/upload">
              <input 
                type="file" 
                accept=".csv,.json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                id="import-tx-input"
              />
              <Button 
                variant="outline" 
                leftIcon={<Upload className="w-4 h-4" />}
                className="shadow-sm border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700"
              >
                Import Data
              </Button>
            </div>
            
            <Button 
              onClick={() => { setEditingTx(null); setIsModalOpen(true); }}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-md shadow-emerald-500/10"
            >
              Add Transaction
            </Button>
          </div>
        )}
      </header>

      {/* Filter Bar */}
      <Card bodyClassName="p-3">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by merchant..." 
              className="w-full h-10 pl-10 pr-4 bg-slate-100/50 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={filters.search}
              onChange={(e) => setFilter('search', e.target.value)}
            />
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
            {['all', 'income', 'expense'].map(type => (
              <button 
                key={type}
                onClick={() => setFilter('type', type)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-wider ${filters.type === type ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {type}
              </button>
            ))}
          </div>

          <select 
            className="h-10 px-3 rounded-lg bg-slate-100/50 border-none text-sm font-medium outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/20"
            value={filters.categories[0] || ''}
            onChange={(e) => setFilter('categories', e.target.value ? [e.target.value] : [])}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <Button variant="ghost" size="sm" onClick={resetFilters} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset
          </Button>
        </div>
      </Card>

      {/* Transaction Table */}
      <Card bodyClassName="p-0 overflow-hidden border-none shadow-elevated">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Merchant</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length > 0 ? paginatedData.map((tx, idx) => (
                <tr 
                  key={tx.id} 
                  onClick={() => handleEdit(tx)}
                  className={`group transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} ${isAdmin ? 'cursor-pointer hover:bg-emerald-50/40' : ''}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{tx.merchant}</p>
                    <div className="md:hidden flex items-center gap-2 mt-1">
                      <Badge variant={tx.type === 'income' ? 'success' : 'neutral'} className="px-1.5 py-0 text-[10px] uppercase">
                        {tx.category}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="neutral" className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      {tx.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 font-mono font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {tx.type === 'income' ? <ArrowUpCircle className="w-3.5 h-3.5" /> : <ArrowDownCircle className="w-3.5 h-3.5" />}
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {isAdmin ? (
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleEdit(tx); }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-md transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(tx.id); }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-md transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-tighter">Read Only</div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                        <Search className="w-10 h-10" />
                      </div>
                      <p className="text-slate-500 font-medium">No transactions match your filters</p>
                      <Button variant="ghost" size="sm" onClick={resetFilters}>Clear all filters</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Page {currentPage} of {Math.max(1, totalPages)}
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:enabled:bg-white hover:enabled:text-slate-900 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:enabled:bg-white hover:enabled:text-slate-900 disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleModalSubmit}
        initialData={editingTx}
      />
    </div>
  );
};

export default TransactionsPage;
