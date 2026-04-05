import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Zap, Clock, 
  ArrowRight, Minus, PieChart as PieIcon,
  ChevronDown, Filter, RotateCcw
} from 'lucide-react';
import { useFinanceStore } from '../store/useFinanceStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../lib/utils';
import { NumberCounter } from '../components/ui/NumberCounter';
import { Button } from '../components/ui/Button';

export const InsightsPage = () => {
  const { transactions, isLoading, savingsGoal, setSavingsGoal } = useFinanceStore();

  // 1. Calculations for Insight Cards
  const stats = useMemo(() => {
    const txList = Array.isArray(transactions) ? transactions : [];
    const expenseTxs = txList.filter(tx => tx.type === 'expense' && !isNaN(parseFloat(tx.amount)));
    
    // Top Category
    const catMap = {};
    expenseTxs.forEach(tx => {
      const cat = tx.category || 'General';
      const amt = parseFloat(tx.amount) || 0;
      catMap[cat] = (catMap[cat] || 0) + amt;
    });
    
    const sortedCats = Object.entries(catMap).sort((a,b) => b[1] - a[1]);
    const topCat = sortedCats[0] || ['None', 0];
    const totalSpend = expenseTxs.reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);
    const topCatPercent = totalSpend > 0 ? (topCat[1] / totalSpend) * 100 : 0;

    // Biggest Single Expense
    const biggest = [...expenseTxs].sort((a,b) => (parseFloat(b.amount) || 0) - (parseFloat(a.amount) || 0))[0] || { merchant: 'N/A', amount: 0 };

    // MoM Change (Month-over-month)
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();
    const lastMonth = curMonth === 0 ? 11 : curMonth - 1;
    const lastYear = curMonth === 0 ? curYear - 1 : curYear;

    const curMonthTotal = expenseTxs.filter(tx => {
      const d = new Date(tx.date);
      return !isNaN(d.getTime()) && d.getMonth() === curMonth && d.getFullYear() === curYear;
    }).reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);

    const lastMonthTotal = expenseTxs.filter(tx => {
      const d = new Date(tx.date);
      return !isNaN(d.getTime()) && d.getMonth() === lastMonth && d.getFullYear() === lastYear;
    }).reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);

    const momChange = lastMonthTotal > 0 ? ((curMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

    // Most Frequent Merchant
    const merchantCounts = {};
    expenseTxs.forEach(tx => {
      const merchant = tx.merchant || 'Unknown';
      merchantCounts[merchant] = (merchantCounts[merchant] || 0) + 1;
    });
    const mostFrequent = Object.entries(merchantCounts).sort((a,b) => b[1] - a[1])[0] || ['None', 0];

    // Highest Spending Weekday
    const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekdaySpend = Array(7).fill(0);
    expenseTxs.forEach(tx => {
      const d = new Date(tx.date);
      if (!isNaN(d.getTime())) weekdaySpend[d.getDay()] += (parseFloat(tx.amount) || 0);
    });
    const maxDayIdx = weekdaySpend.indexOf(Math.max(...weekdaySpend));
    const highestDay = dayMap[maxDayIdx] || 'N/A';

    return {
      topCategory: { name: topCat[0], amount: topCat[1], percent: parseFloat(topCatPercent || 0).toFixed(1) },
      biggestExpense: biggest,
      momChange: { value: Math.abs(momChange || 0).toFixed(1), isUp: momChange > 0, total: curMonthTotal },
      totalSpend,
      mostFrequentMerchant: { name: mostFrequent[0], count: mostFrequent[1] },
      highestSpendingDay: highestDay,
      avgTransactionValue: expenseTxs.length > 0 ? (totalSpend / expenseTxs.length) : 0
    };
  }, [transactions]);

  // 2. BarChart Data (Monthly Comparison)
  const barData = useMemo(() => {
    const txList = Array.isArray(transactions) ? transactions : [];
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = d.toLocaleString('default', { month: 'short' });
      const income = txList.filter(tx => {
        const dd = new Date(tx.date);
        return !isNaN(dd.getTime()) && dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear() && tx.type === 'income';
      }).reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);
      const expense = txList.filter(tx => {
        const dd = new Date(tx.date);
        return !isNaN(dd.getTime()) && dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear() && tx.type === 'expense';
      }).reduce((acc, tx) => acc + (parseFloat(tx.amount) || 0), 0);
      months.push({ name: mLabel, income: income || 0, expense: expense || 0, net: (income || 0) - (expense || 0) });
    }
    return months;
  }, [transactions]);

  // 3. Spending Velocity
  const velocity = useMemo(() => {
    const now = new Date();
    const dayOfMonth = now.getDate() || 1;
    const averageDaily = (stats.momChange.total || 0) / dayOfMonth;
    const projected = averageDaily * 30; 
    const budget = savingsGoal;
    const utilization = (stats.momChange.total / budget) * 100;
    
    return { 
      averageDaily: averageDaily || 0, 
      projected: projected || 0, 
      budget, 
      utilization: Math.min(100, isNaN(utilization) ? 0 : utilization).toFixed(1) 
    };
  }, [stats, savingsGoal]);

  const [isEditingGoal, setIsEditingGoal] = React.useState(false);
  const [tempGoal, setTempGoal] = React.useState(savingsGoal);

  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-6">
        <header><LoadingSkeleton width={200} height={32} /></header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <LoadingSkeleton height={160} rounded="xl" />
          <LoadingSkeleton height={160} rounded="xl" />
          <LoadingSkeleton height={160} rounded="xl" />
        </div>
        <LoadingSkeleton height={400} rounded="2xl" />
      </div>
    );
  }

  const handleSaveGoal = () => {
    const val = parseFloat(tempGoal);
    if (!isNaN(val) && val > 0) {
      setSavingsGoal(val);
      setIsEditingGoal(false);
    }
  };

  const COLORS = ['#22C55E', '#F43F5E', '#3B82F6', '#A855F7', '#EAB308', '#06B6D4', '#F97316'];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Financial Insights</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Data-driven analysis of your spending habits and trend patterns based on your records</p>
      </header>

      {/* A. Insight Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm hover:shadow-card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <PieIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge variant="info" className="text-[10px] uppercase font-bold tracking-widest">{stats.topCategory.percent}% of spend</Badge>
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Top Category</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{stats.topCategory.name}</h3>
          <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.topCategory.amount)} total</p>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-rose-50 dark:bg-rose-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Large Expense</span>
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Biggest Single Expense</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate mb-1">{stats.biggestExpense?.merchant || 'N/A'}</h3>
          <p className="text-sm font-mono font-bold text-rose-600 dark:text-rose-400">{formatCurrency(stats.biggestExpense?.amount || 0)}</p>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-card-hover group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 bg-sky-50 dark:bg-sky-500/10 rounded-xl group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            </div>
            {stats.momChange.isUp ? (
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-tighter">
                <TrendingUp className="w-3.5 h-3.5" /> {stats.momChange.value}% UP
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-tighter">
                <TrendingDown className="w-3.5 h-3.5" /> {stats.momChange.value}% DOWN
              </div>
            )}
          </div>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">MoM Spending Change</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {stats.momChange.isUp ? 'Increased Spend' : 'Reduced Spend'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium italic">Compared to previous month</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B. Monthly Comparison BarChart */}
        <Card bodyClassName="p-0 border-none shadow-elevated">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly Comparison</h3>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-full uppercase tracking-widest leading-none">Net View</span>
          </div>
          <div className="p-3 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b830" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', color: '#fff' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}
                  formatter={(v) => formatCurrency(v)}
                />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={25} />
                <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* C. Quick Observations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <Card className="border-none shadow-sm flex flex-col justify-center">
             <div className="p-2 w-fit bg-indigo-50 dark:bg-indigo-500/10 rounded-lg mb-4 text-indigo-600 dark:text-indigo-400">
               <RotateCcw className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Most Frequent</p>
             <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">{stats.mostFrequentMerchant.name}</h4>
             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stats.mostFrequentMerchant.count} visits this period</p>
           </Card>

           <Card className="border-none shadow-sm flex flex-col justify-center">
             <div className="p-2 w-fit bg-emerald-50 dark:bg-emerald-500/10 rounded-lg mb-4 text-emerald-600 dark:text-emerald-400">
               <TrendingUp className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Highest Spend Day</p>
             <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{stats.highestSpendingDay}</h4>
             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Peaks on this day</p>
           </Card>

           <Card className="border-none shadow-sm flex flex-col justify-center">
             <div className="p-2 w-fit bg-amber-50 dark:bg-amber-500/10 rounded-lg mb-4 text-amber-600 dark:text-amber-400">
               <Zap className="w-5 h-5" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Typical Purchase</p>
             <h4 className="text-xl font-bold text-slate-900 dark:text-white font-mono tracking-tighter">{formatCurrency(stats.avgTransactionValue)}</h4>
             <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[140px]">Average transaction size</p>
           </Card>

           <Card className="border-none shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-center bg-slate-900 dark:bg-indigo-950/40 text-white group cursor-pointer overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <PieIcon className="w-16 h-16" />
              </div>
              <p className="text-[10px] font-bold text-indigo-300 dark:text-indigo-400 uppercase tracking-widest mb-1 relative z-10">Top Strategy</p>
              <h4 className="text-lg font-bold text-white relative z-10">Diversification</h4>
              <p className="text-xs text-slate-300 dark:text-slate-400 relative z-10">Review for savings</p>
           </Card>
        </div>
      </div>

      {/* D. Spending Velocity & Goal Progress */}
      <Card bodyClassName="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Monthly Budget Utilization</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on a fixed target budget of {formatCurrency(velocity.budget)}/month</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400"><NumberCounter value={velocity.utilization} />%</span>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Utilized</p>
              </div>
            </div>
            
            <div className="relative w-full h-8 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner p-1 border border-slate-200 dark:border-slate-700">
              <div 
                className={`h-full rounded-xl transition-all duration-1000 ease-out shadow-sm ${parseFloat(velocity.utilization) > 90 ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700'}`}
                style={{ width: `${velocity.utilization}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Avg Daily Spend</p>
                <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">{formatCurrency(velocity.averageDaily)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Projected Out</p>
                <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200 underline decoration-emerald-200 dark:decoration-emerald-900 decoration-2 underline-offset-4">{formatCurrency(velocity.projected)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Remaining</p>
                <p className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(Math.max(0, velocity.budget - stats.momChange.total))}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Safe to spend/day</p>
                <p className="text-base font-mono font-bold text-blue-600 dark:text-blue-400">{formatCurrency(Math.max(0, (velocity.budget - stats.momChange.total) / (30 - new Date().getDate())))}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-md border dark:border-slate-700 flex items-center justify-center">
              <Target className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
            </div>

            {isEditingGoal ? (
              <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center gap-2">
                   <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest leading-none">Monthly Target ($)</p>
                   <input 
                    type="number"
                    value={tempGoal}
                    onChange={(e) => setTempGoal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveGoal()}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 transition-all"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" className="flex-1 text-xs py-2 rounded-lg" onClick={() => setIsEditingGoal(false)}>Cancel</Button>
                  <Button variant="primary" className="flex-1 text-xs py-2 rounded-lg shadow-elevated" onClick={handleSaveGoal}>Save</Button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Savings Goal: {formatCurrency(savingsGoal)}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[180px]">Maintain current spending to reach your goal by end of month.</p>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full text-xs py-2 px-4 shadow-elevated transition-transform hover:-translate-y-0.5"
                  onClick={() => {
                    setTempGoal(savingsGoal);
                    setIsEditingGoal(true);
                  }}
                >
                  Customize Goals
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InsightsPage;
