import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Briefcase, Users, ShoppingBag,
  Sparkles, Settings, LogOut, Menu, X, Bell, Search,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/crm', icon: Briefcase, label: 'Brand CRM' },
  { to: '/team', icon: Users, label: 'Team & Tasks' },
  { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  { to: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed z-30 inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base tracking-tight">CreatorVerse<span className="text-brand-600">.AI</span></span>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                clsx('sidebar-item', isActive ? 'sidebar-item-active' : 'sidebar-item-inactive')
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx('sidebar-item', isActive ? 'sidebar-item-active' : 'sidebar-item-inactive')
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Creator'}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.plan || 'Professional'}</p>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); handleLogout(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Logout"
            >
              <LogOut size={15} className="text-gray-400 hover:text-red-500" />
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} className="text-gray-500" />
          </button>

          <div className="flex-1 max-w-md relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals, tasks, creators..."
              className="w-full pl-9 pr-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <Link to="/settings" className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
