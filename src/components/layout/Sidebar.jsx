import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, BarChart3,
  X, BarChart2, Shield, Eye, ChevronUp
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ROUTES } from '../../lib/constants';

const NAV_ITEMS = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Transactions', icon: CreditCard,       path: ROUTES.TRANSACTIONS },
  { label: 'Insights',     icon: BarChart2,        path: ROUTES.INSIGHTS },
];

/**
 * Fixed left sidebar (240 px wide).
 * On mobile it becomes a slide-in drawer controlled by isOpen / onClose.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen   - Whether the mobile drawer is visible
 * @param {Function} props.onClose  - Callback to dismiss drawer
 * @returns {JSX.Element}
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthContext();
  const { role, setRole } = useFinanceStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Panel ── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-60 flex flex-col
          bg-[#0f172a] border-r border-slate-800/80
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:translate-x-0 lg:shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* ── Logo row ── */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80 shrink-0">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md shrink-0">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight select-none">
              Finova
            </span>
          </NavLink>

          {/* Mobile close */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 py-5 px-3 flex flex-col gap-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-2">
            Main
          </p>

          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === ROUTES.DASHBOARD}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 transition-all duration-150 group
                 ${isActive
                   ? 'bg-slate-800 text-white'
                   : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Emerald left accent */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-primary-500 transition-all duration-200 ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                    }`}
                  />
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}

        </nav>

        {/* ── Role Switcher & User ── */}
        <div className="px-3 pb-6 pt-2 border-t border-slate-800/80 shrink-0 space-y-3">
          
          {/* Role Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-700/50 text-xs font-bold text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-2">
                {role === 'admin' ? <Shield className="w-3.5 h-3.5 text-emerald-400" /> : <Eye className="w-3.5 h-3.5 text-blue-400" />}
                <span className="uppercase tracking-wider">{role} Mode</span>
              </div>
              <ChevronUp className={`w-3.5 h-3.5 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
            </button>

            {showRoleMenu && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-[#1e293b] border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                <button 
                  onClick={() => { setRole('admin'); setShowRoleMenu(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase transition-colors ${role === 'admin' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <Shield className="w-3.5 h-3.5" /> Admin
                </button>
                <button 
                  onClick={() => { setRole('viewer'); setShowRoleMenu(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-bold uppercase transition-colors ${role === 'viewer' ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                >
                  <Eye className="w-3.5 h-3.5" /> Viewer
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/30">
            <Avatar
              name={user?.displayName || user?.email}
              src={user?.photoURL}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate leading-none mb-1.5">
                {user?.displayName || 'Founder'}
              </p>
              <Badge variant={role === 'admin' ? 'success' : 'neutral'} className="text-[9px] px-1.5 py-0 uppercase tracking-tighter">
                {role}
              </Badge>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
