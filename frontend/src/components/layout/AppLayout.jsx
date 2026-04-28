import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Briefcase, Users, ShoppingBag,
  Sparkles, Settings, LogOut, Bell, Search, Zap,
  UserCircle, ChevronDown, Moon, Sun, Check
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { useTheme } from '../../context/ThemeContext';
import SearchBar from './SearchBar';

const navItems = [
  { to: '/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/analytics',   icon: BarChart3,        label: 'Analytics'   },
  { to: '/crm',         icon: Briefcase,        label: 'Brand CRM'   },
  { to: '/team',        icon: Users,            label: 'Team & Tasks' },
  { to: '/marketplace', icon: ShoppingBag,      label: 'Marketplace' },
  { to: '/ai',          icon: Sparkles,         label: 'AI Assistant' },
];

export default function AppLayout() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const dropdownRef = useRef(null);
  const notifRef    = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (notifRef.current    && !notifRef.current.contains(e.target))    setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { setDropdownOpen(false); logout(); navigate('/login'); };
  const initials = user?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="flex flex-col h-screen bg-[#f8f9fc] dark:bg-[#0f1117] overflow-hidden">

      {/* ══ HEADER ════════════════════════════════════════════════════ */}
      <header className="h-[60px] bg-white dark:bg-gray-900 border-b border-gray-100/80 dark:border-gray-800 flex items-center px-6 gap-5 flex-shrink-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 flex-shrink-0 select-none group">
          <div className="relative w-9 h-9 rounded-[12px] bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 flex items-center justify-center shadow-lg shadow-indigo-300/50 group-hover:shadow-indigo-400/60 group-hover:scale-[1.05] transition-all duration-200">
            {/* Zap icon - custom white */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L4.5 13.5H11.5L11 22L19.5 10.5H12.5L13 2Z" fill="white" stroke="white" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
            {/* subtle shine overlay */}
            <div className="absolute inset-0 rounded-[12px] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
          </div>
          <div className="leading-none">
            <span className="text-[17px] font-extrabold tracking-tight text-gray-900 dark:text-white">
              Creator<span className="text-indigo-600 dark:text-indigo-400">Verse</span>
            </span>
            <p className="text-[10px] font-medium text-gray-400 tracking-wide mt-0.5">Creator Platform</p>
          </div>
        </Link>

        {/* Search */}
        <SearchBar />

        {/* Right */}
        <div className="ml-auto flex items-center gap-1.5">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150"
            title={isDark ? 'Switch to light' : 'Switch to dark'}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => { setNotifOpen(p => !p); setDropdownOpen(false); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-[8px] text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all duration-150"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] bg-indigo-500 rounded-full ring-[1.5px] ring-white" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-[44px] w-[340px] bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/60 py-1 z-50" style={{ animation: 'dropIn 0.15s ease-out' }}>
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                  <p className="text-xs font-semibold text-gray-800 tracking-wide">Notifications</p>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">3 new</span>
                </div>
                {[
                  { text: 'Nike deal deadline in 3 days', time: '2h ago', dot: 'bg-red-500', sub: 'Brand Deals' },
                  { text: 'New brand request from Puma', time: '5h ago', dot: 'bg-indigo-500', sub: 'Incoming' },
                  { text: 'Analytics report is ready', time: '1d ago', dot: 'bg-emerald-500', sub: 'Reports' },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors">
                    <span className={`mt-[5px] w-2 h-2 rounded-full flex-shrink-0 ${n.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] text-gray-800 font-medium leading-snug">{n.text}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-gray-400">{n.sub}</span>
                        <span className="text-[11px] text-gray-300">·</span>
                        <span className="text-[11px] text-gray-400">{n.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-2.5 border-t border-gray-50">
                  <button className="text-[12px] text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">View all notifications →</button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Avatar + dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              id="avatar-menu-btn"
              onClick={() => { setDropdownOpen(p => !p); setNotifOpen(false); }}
              className="flex items-center gap-2 px-2 py-1 rounded-[10px] hover:bg-gray-100 transition-all duration-150"
            >
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden ring-2 ring-indigo-100 flex-shrink-0">
                {user?.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                }
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[13px] font-semibold text-gray-800 leading-none">{user?.name?.split(' ')[0] || 'Creator'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{user?.plan || 'Pro'} plan</p>
              </div>
              <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-[46px] w-[240px] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-200/70 dark:shadow-black/40 py-1.5 z-50" style={{ animation: 'dropIn 0.15s ease-out' }}>
                {/* User card */}
                <div className="mx-2 mb-1 px-3 py-3 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
                      {user?.avatar
                        ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">{initials}</div>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-gray-900 dark:text-white truncate">{user?.name || 'Creator'}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{user?.email || 'creator@example.com'}</p>
                      <span className="inline-flex items-center gap-1 mt-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-full shadow-sm capitalize">
                        <Check size={8} strokeWidth={3} /> {user?.plan || 'Professional'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div className="px-1.5 py-1">
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <UserCircle size={14} className="text-gray-400" /> Edit Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Settings size={14} className="text-gray-400" /> Settings
                  </Link>
                </div>

                <div className="mx-1.5 border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ══ NAV BAR ═══════════════════════════════════════════════════ */}
      <nav className="h-[54px] bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-end justify-center px-6 flex-shrink-0 z-30 overflow-x-auto scrollbar-none gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-5 h-full text-[15px] font-bold whitespace-nowrap tracking-[-0.01em] transition-all duration-150 border-b-[2.5px] -mb-px ${
                isActive
                  ? 'text-indigo-600 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'text-gray-500 border-transparent hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-indigo-500' : 'text-gray-400'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ══ PAGE CONTENT ══════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </div>
      </main>

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
