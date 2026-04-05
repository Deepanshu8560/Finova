import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Entertainment', 'Shopping', 'Utilities', 'Health', 'Salary', 'Dividend', 'Freelance'];

export const TransactionModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    amount: '',
    category: 'Food',
    type: 'expense'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: Math.abs(initialData.amount).toString()
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        merchant: '',
        amount: '',
        category: 'Food',
        type: 'expense'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.merchant || !formData.amount) return;
    
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900">{initialData ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Type</label>
              <div className="flex p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income' })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${formData.type === 'income' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense' })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${formData.type === 'expense' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'}`}
                >
                  Expense
                </button>
              </div>
            </div>
            <Input 
              label="Date" 
              type="date" 
              value={formData.date} 
              onChange={e => setFormData({ ...formData, date: e.target.value })} 
              required 
            />
          </div>

          <Input 
            label="Merchant / Description" 
            placeholder="e.g. Whole FoodsMarket" 
            value={formData.merchant} 
            onChange={e => setFormData({ ...formData, merchant: e.target.value })} 
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
              <select 
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Input 
              label="Amount" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={formData.amount} 
              onChange={e => setFormData({ ...formData, amount: e.target.value })} 
              required 
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={onClose} type="button">Cancel</Button>
            <Button type="submit" className="flex-1" leftIcon={<Save className="w-4 h-4" />}>
              {initialData ? 'Save Changes' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
