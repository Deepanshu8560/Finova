import React, { useState, useRef, useEffect } from 'react';
import { LogOut, Menu, ChevronDown, User, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { useAuthContext } from '../../context/AuthContext';
import { useLocation, NavLink } from 'react-router-dom';
import { ROUTES } from '../../lib/constants';

const PAGE_TITLES = {
  [ROUTES.DASHBOARD]:   'Overview',
  [ROUTES.REVENUE]:     'Revenue',
  [ROUTES.USERS]:       'Users',
  [ROUTES.ACQUISITION]: 'Acquisition',
  [ROUTES.SETTINGS]:    'Settings',
};

/**
 * Sticky top header bar (white bg, subtle border).
 *
 * @param {Object}   props
 * @param {Function} props.onMenuClick        — Opens the mobile sidebar drawer
 * @param {boolean}  [props.isAILoading=false] — Triggers the GitHub-style progress bar
 * @returns {JSX.Element}
 */
export const Header = ({ onMenuClick, isAILoading = false }) => {
  const { user, logout } = useAuthContext();
  const location         = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef      = useRef(null);

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Dashboard';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200/80">

      {/* GitHub-style AI loading progress bar */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] overflow-hidden transition-opacity duration-300 ${
          isAILoading ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-slate-100" />
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 rounded-full"
          style={{ animation: 'progress-bar 1.4s ease-in-out infinite', width: '65%' }}
        />
      </div>

      <div className="flex items-center justify-between h-14 px-4 sm:px-6">

        {/* Left — hamburger + breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900">{pageTitle}</h1>
          </div>
        </div>

        {/* Right — avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="header-user-menu"
            onClick={() => setDropdownOpen(d => !d)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-150"
          >
            <Avatar
              name={user?.displayName || user?.email}
              src={user?.photoURL}
              size="sm"
            />
            <span className="text-sm font-semibold text-slate-700 hidden sm:block leading-none">
              {user?.displayName || user?.email?.split('@')[0] || 'Founder'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-elevated overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {user?.displayName || 'Founder'}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {user?.email || 'founder@startup.com'}
                </p>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <NavLink
                  to={ROUTES.SETTINGS}
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Settings
                </NavLink>
                <button
                  id="header-logout-btn"
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
