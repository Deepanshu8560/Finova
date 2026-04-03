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
    { name: 'Stripe', description: 'Revenue & billing data', icon: CreditCard, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Mixpanel', description: 'Product analytics', icon: BarChart3, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { name: 'Google Analytics', description: 'Web traffic & acquisition', icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-heading font-bold text-slate-50">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and data connections</p>
      </div>

      {/* Profile Section */}
      <section>
        <h2 className="text-lg font-medium text-slate-200 mb-4">Profile</h2>
        <Card>
          <div className="flex items-center gap-6">
            <Avatar 
              name={user?.displayName || user?.email} 
              src={user?.photoURL}
              size="xl" 
            />
            <div className="flex-1 space-y-2">
              <div>
                <label className="text-xs font-medium text-slate-400 pb-1">Email Address</label>
                <div className="text-slate-100 font-medium px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
              <p className="text-xs text-slate-500">
                To change your email address, please contact support.
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Data Connections Section */}
      <section>
        <h2 className="text-lg font-medium text-slate-200 mb-4">Connected Data Sources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {dataSources.map((source) => (
            <Card key={source.name} hover className="relative overflow-hidden group">
              <div className="absolute top-3 right-3">
                <Badge variant="purple" className="text-[10px] py-0.5 px-2">Coming Soon</Badge>
              </div>
              
              <div className={`w-10 h-10 ${source.bg} ${source.color} rounded-lg flex items-center justify-center mb-4`}>
                <source.icon className="w-5 h-5" />
              </div>
              
              <h3 className="text-base font-semibold text-slate-100 mb-1">{source.name}</h3>
              <p className="text-sm text-slate-400 mb-6">{source.description}</p>
              
              <div className="mt-auto pt-4 border-t border-slate-800/60">
                <button disabled className="w-full flex items-center justify-center gap-2 text-sm font-medium text-slate-500 cursor-not-allowed group-hover:text-primary-400 transition-colors">
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
