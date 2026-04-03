import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, TrendingUp, Users, Megaphone,
  X, BarChart3, UploadCloud, Lightbulb
} from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useDataContext } from '../../context/DataContext';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { ROUTES } from '../../lib/constants';

const NAV_ITEMS = [
  { label: 'Overview',     icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Revenue',      icon: TrendingUp,       path: ROUTES.REVENUE },
  { label: 'Users',        icon: Users,            path: ROUTES.USERS },
  { label: 'Acquisition',  icon: Megaphone,        path: ROUTES.ACQUISITION },
  { label: 'Suggestions',  icon: Lightbulb,        path: ROUTES.SUGGESTIONS },
];

/**
 * Fixed left sidebar (240 px wide).
 * On mobile it becomes a slide-in drawer controlled by isOpen / onClose.
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen   — Whether the mobile drawer is visible
 * @param {Function} props.onClose  — Callback to dismiss drawer
 * @returns {JSX.Element}
 */
export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuthContext();
  const { uploadFile } = useDataContext();
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

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
              InsightAI
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

          <button
            onClick={() => fileInputRef.current?.click()}
            className="relative flex justify-start items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 w-full mb-1"
          >
            <UploadCloud className="w-4 h-4 shrink-0 transition-colors text-slate-500 group-hover:text-slate-300" />
            <span>Upload Data</span>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv,.pdf,.docx" 
              onChange={handleFileUpload} 
            />
          </button>

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

        {/* ── User profile ── */}
        <div className="px-3 pb-4 pt-2 border-t border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 backdrop-blur-sm">
            <Avatar
              name={user?.displayName || user?.email}
              src={user?.photoURL}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate leading-none mb-1">
                {user?.displayName || 'Founder'}
              </p>
              <Badge variant="success" className="text-[10px] px-1.5 py-0">
                Pro Plan
              </Badge>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
