import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Database, Link as LinkIcon, BarChart3, CreditCard } from 'lucide-react';

/**
 * Settings page for managing user profile and data connections.
 * Displays connected data sources in a grid.
 * @returns {JSX.Element}
 */
export function SettingsPage() {
  const { user } = useAuthContext();

  const dataSources = [
    { name: 'Stripe', description: 'Revenue & billing data', icon: CreditCard, color: 'text-indigo-400 dark:text-indigo-300', bg: 'bg-indigo-500/10' },
    { name: 'Mixpanel', description: 'Product analytics', icon: BarChart3, color: 'text-purple-400 dark:text-purple-300', bg: 'bg-purple-500/10' },
    { name: 'Google Analytics', description: 'Web traffic & acquisition', icon: Database, color: 'text-amber-400 dark:text-amber-300', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your account and data connections</p>
      </div>

      {/* Profile Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 px-1">Profile</h2>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <Avatar 
              name={user?.displayName || user?.email} 
              src={user?.photoURL}
              size="xl" 
              className="ring-4 ring-white dark:ring-slate-800 shadow-xl"
            />
            <div className="flex-1 w-full space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest block mb-2">Email Address</label>
                <div className="text-slate-900 dark:text-slate-100 font-mono font-bold px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl transition-colors">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 font-medium italic">
                To change your email address, please contact support.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Data Connections Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-200 mb-4 px-1">Connected Data Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {dataSources.map((source) => (
            <Card key={source.name} hover className="relative overflow-hidden group flex flex-col items-center text-center p-6 bg-white dark:bg-slate-900/50">
              <div className="absolute top-4 right-4">
                <Badge variant="purple" className="text-[10px] py-0.5 px-2 font-bold tracking-tighter uppercase">Beta</Badge>
              </div>
              
              <div className={`w-14 h-14 ${source.bg} ${source.color} rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <source.icon className="w-7 h-7" />
              </div>
              
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tight">{source.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">{source.description}</p>
              
              <div className="mt-auto w-full pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button disabled className="w-full flex items-center justify-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-600 cursor-not-allowed group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors uppercase tracking-widest">
                  <LinkIcon className="w-4 h-4" />
                  Connect
                </button>
              </div>
            </Card>
          ))}
          
        </div>
      </section>
    </div>
  );
}
