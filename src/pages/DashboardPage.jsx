import React, { useMemo, useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Wallet, DollarSign, CreditCard, PieChart as PieIcon,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { ROUTES } from '../lib/constants';
import { NumberCounter } from '../components/ui/NumberCounter';

const COLORS = ['#22C55E', '#3B82F6', '#F43F5E', '#A855F7', '#EAB308', '#06B6D4', '#F97316'];

const DashboardPage = () => {
  const { transactions, getSummary } = useFinanceStore();
  const [timeRange, setTimeRange] = useState('all');
  const summary = getSummary();

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [transactions]);

  // Prepare chart data for Balance Trend based on time range
  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    
    if (timeRange === '30d') {
      // Daily aggregation for 30 days
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const income = transactions.filter(tx => {
          const dd = new Date(tx.date);
          return dd.toDateString() === d.toDateString() && tx.type === 'income';
        }).reduce((acc, tx) => acc + (tx.amount || 0), 0);
        const expense = transactions.filter(tx => {
          const dd = new Date(tx.date);
          return dd.toDateString() === d.toDateString() && tx.type === 'expense';
        }).reduce((acc, tx) => acc + (tx.amount || 0), 0);
        data.push({ name: label, income, expense });
      }
    } else if (timeRange === '90d') {
      // Weekly aggregation for 90 days (approx 13 weeks)
      for (let i = 12; i >= 0; i--) {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7 + 6));
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (i * 7));
        const label = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        const income = transactions.filter(tx => {
          const dd = new Date(tx.date);
          return dd >= start && dd <= end && tx.type === 'income';
        }).reduce((acc, tx) => acc + (tx.amount || 0), 0);
        const expense = transactions.filter(tx => {
          const dd = new Date(tx.date);
          return dd >= start && dd <= end && tx.type === 'expense';
        }).reduce((acc, tx) => acc + (tx.amount || 0), 0);
        data.push({ name: label, income, expense });
      }
    } else {
      // Monthly aggregation for all time (show last 6/12 months or all)
      const monthlyData = {};
      const months = [];
      const oldestDate = transactions.length > 0 
        ? new Date(Math.min(...transactions.map(t => new Date(t.date).getTime())))
        : new Date(now.getFullYear(), now.getMonth() - 5, 1);
      
      const start = new Date(oldestDate.getFullYear(), oldestDate.getMonth(), 1);
      let current = new Date(start);
      
      while (current <= now) {
        const mLabel = current.toLocaleString('default', { month: 'short', year: '2-digit' });
        months.push(mLabel);
        monthlyData[mLabel] = { name: mLabel, income: 0, expense: 0, month: current.getMonth(), year: current.getFullYear() };
        current.setMonth(current.getMonth() + 1);
      }

      transactions.forEach(tx => {
        const d = new Date(tx.date);
        const mLabel = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyData[mLabel]) {
          if (tx.type === 'income') monthlyData[mLabel].income += (tx.amount || 0);
          else monthlyData[mLabel].expense += (tx.amount || 0);
        }
      });
      return months.map(m => monthlyData[m]);
    }

    return data;
  }, [transactions, timeRange]);

  // Helper for filtering by range
  const filteredTransactionsByRange = useMemo(() => {
    const now = new Date();
    if (timeRange === '30d') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      return transactions.filter(tx => new Date(tx.date) >= start);
    }
    if (timeRange === '90d') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
      return transactions.filter(tx => new Date(tx.date) >= start);
    }
    return transactions;
  }, [transactions, timeRange]);

  // Prepare data for Category Donut
  const categoryData = useMemo(() => {
    const counts = {};
    filteredTransactionsByRange.filter(tx => tx.type === 'expense').forEach(tx => {
      counts[tx.category] = (counts[tx.category] || 0) + tx.amount;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactionsByRange]);

  const RangeFilter = ({ current, onChange }) => (
    <div className="flex items-center p-1 bg-slate-100 rounded-lg shrink-0">
      {['30d', '90d', 'all'].map(r => (
        <button 
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all uppercase tracking-wider ${current === r ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          {r}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Financial Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Real-time health check of your personal finances</p>
        </div>
        <Link to={ROUTES.TRANSACTIONS} className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 transition-all bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl border border-emerald-100/50 shadow-sm">
          Transaction History <ChevronRight className="w-4 h-4" />
        </Link>
      </header>

      {/* A. Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50/50 to-white hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 shadow-sm">
              <Wallet className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-1 rounded-full shadow-sm border border-indigo-100/50">
              <TrendingUp className="w-3 h-3" />
              <span>12.5%</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Balance</p>
          <h2 className="text-3xl font-bold text-slate-900 leading-none">
            <NumberCounter value={summary.totalBalance} formatter={formatCurrency} />
          </h2>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50/50 to-white hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50/80 px-2 py-1 rounded-full shadow-sm border border-emerald-100/50">
              <TrendingUp className="w-3 h-3" />
              <span>8.3%</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Income</p>
          <h2 className="text-3xl font-bold text-slate-900 leading-none">
            <NumberCounter value={summary.totalIncome} formatter={formatCurrency} />
          </h2>
        </Card>

        <Card className="border-none shadow-sm bg-gradient-to-br from-rose-50/50 to-white hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-100 rounded-2xl text-rose-600 shadow-sm">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50/80 px-2 py-1 rounded-full shadow-sm border border-rose-100/50">
              <TrendingDown className="w-3 h-3" />
              <span>4.1%</span>
            </div>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Expenses</p>
          <h2 className="text-3xl font-bold text-slate-900 leading-none">
            <NumberCounter value={summary.totalExpenses} formatter={formatCurrency} />
          </h2>
        </Card>
      </div>

      {/* B. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Balance Trend (2/3 width) */}
        <Card className="lg:col-span-2 border-none shadow-elevated" bodyClassName="p-0">
          <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-none">Balance Trend</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Cash flow activity</p>
            </div>
            <div className="flex items-center gap-4">
              <RangeFilter current={timeRange} onChange={setTimeRange} />
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tight shadow-sm border border-emerald-100/50">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Trend View</span>
              </div>
            </div>
          </div>
        <div className="p-6 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={12} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={(v) => `${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', padding: '12px', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}
                  formatter={(v) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="income" name="Balance" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#balanceFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Spending Breakdown (1/3 width) */}
        <Card className="lg:col-span-1 border-none shadow-elevated flex flex-col h-full bg-white">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-none">Spending Breakdown</h3>
              <p className="text-[11px] text-slate-400 font-medium mt-1">By category</p>
            </div>
            <RangeFilter current={timeRange} onChange={setTimeRange} />
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4 flex-1">
            <div className="relative w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={6}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(v) => formatCurrency(v)}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', padding: '10px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase leading-none mb-0.5">Total</p>
                  <p className="text-sm font-mono font-bold text-slate-900 leading-none">
                    {formatCurrency(categoryData.reduce((acc, c) => acc + c.value, 0)).split('.')[0]}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-2.5 w-full">
               {categoryData.slice(0, 7).map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between group">
                     <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-[11px] font-bold text-slate-600 truncate max-w-[80px] uppercase tracking-tight">{category.name}</span>
                     </div>
                     <span className="text-[11px] font-mono font-bold text-slate-900">{formatCurrency(category.value)}</span>
                  </div>
               ))}
            </div>
          </div>
        </Card>
      </div>

      {/* C. Recent Flows (Full Width) */}
      <Card className="border-none shadow-elevated" bodyClassName="p-0">
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            Recent Flows <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          </h3>
          <Link to={ROUTES.TRANSACTIONS} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">Browse Ledger</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-6 p-8 overflow-y-auto min-h-[300px]">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center gap-6 group hover:-translate-y-0.5 transition-all duration-300">
              <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 group-hover:shadow-md ${tx.type === 'income' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-rose-50 text-rose-600 border border-rose-100/50'}`}>
                {tx.type === 'income' ? <ArrowUpRight className="w-6.5 h-6.5" /> : <ArrowDownRight className="w-6.5 h-6.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-slate-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-wider">{tx.merchant}</p>
                <div className="flex items-center gap-2 mt-1.5">
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{tx.category}</span>
                   <span className="text-[10px] text-slate-300 font-bold">•</span>
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-base font-mono font-bold tracking-tight ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
