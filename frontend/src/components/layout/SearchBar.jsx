import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, CheckSquare, Users, LayoutDashboard, BarChart3, ShoppingBag, Sparkles, Settings, X, ArrowRight } from 'lucide-react';
import api from '../../services/api';

// Static pages always shown when no results
const PAGES = [
  { type: 'page', title: 'Dashboard',   subtitle: 'Overview & stats',        url: '/dashboard',   icon: LayoutDashboard },
  { type: 'page', title: 'Analytics',   subtitle: 'Platform analytics',       url: '/analytics',   icon: BarChart3 },
  { type: 'page', title: 'Brand CRM',   subtitle: 'Manage brand deals',       url: '/crm',         icon: Briefcase },
  { type: 'page', title: 'Team & Tasks',subtitle: 'Team management',          url: '/team',        icon: Users },
  { type: 'page', title: 'Marketplace', subtitle: 'Find freelancers',         url: '/marketplace', icon: ShoppingBag },
  { type: 'page', title: 'AI Insights', subtitle: 'AI recommendations',       url: '/ai-insights', icon: Sparkles },
  { type: 'page', title: 'Settings',    subtitle: 'Account & preferences',    url: '/settings',    icon: Settings },
];

const TYPE_META = {
  deal:   { label: 'Deal',   color: 'bg-emerald-100 text-emerald-700', icon: Briefcase },
  task:   { label: 'Task',   color: 'bg-blue-100 text-blue-700',       icon: CheckSquare },
  member: { label: 'Member', color: 'bg-purple-100 text-purple-700',   icon: Users },
  page:   { label: 'Page',   color: 'bg-gray-100 text-gray-600',       icon: LayoutDashboard },
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchBar() {
  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [open,     setOpen]     = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef  = useRef(null);
  const panelRef  = useRef(null);
  const navigate  = useNavigate();
  const debouncedQuery = useDebounce(query, 280);

  // ── Keyboard shortcut Ctrl+K / ⌘K ──────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === 'Escape') { setOpen(false); setQuery(''); inputRef.current?.blur(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Outside click ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Fetch from MongoDB ──────────────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then(r => { setResults(r.data.results || []); setSelected(0); })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  // Items shown in dropdown
  const filteredPages = query
    ? PAGES.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.subtitle.toLowerCase().includes(query.toLowerCase()))
    : PAGES.slice(0, 4);

  const allItems = query ? [...results, ...filteredPages] : filteredPages;

  // ── Keyboard navigation ─────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown')  { e.preventDefault(); setSelected(s => Math.min(s + 1, allItems.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && allItems[selected]) { navigateTo(allItems[selected]); }
  };

  const navigateTo = (item) => {
    navigate(item.url);
    setOpen(false);
    setQuery('');
    inputRef.current?.blur();
  };

  const groupedResults = query ? results.reduce((acc, r) => {
    const key = r.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {}) : {};

  return (
    <div ref={panelRef} className="relative w-[280px]">
      {/* Input */}
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search anything..."
          className="w-full pl-9 pr-14 py-[7px] bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-[10px] text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
        />
        {query ? (
          <button onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
            className="absolute right-2 p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors">
            <X size={12} />
          </button>
        ) : (
          <kbd className="absolute right-2.5 hidden sm:flex items-center gap-0.5 text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1.5 py-0.5 pointer-events-none">⌘K</kbd>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-[calc(100%+8px)] left-0 w-[380px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl shadow-gray-200/60 dark:shadow-black/50 z-[999] overflow-hidden"
          style={{ animation: 'dropIn 0.13s ease-out' }}
        >
          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
              <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              Searching...
            </div>
          )}

          {/* No results from DB */}
          {!loading && query && results.length === 0 && filteredPages.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium text-gray-500">No results for "<span className="text-gray-800 dark:text-gray-200">{query}</span>"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for a deal name, task, or team member</p>
            </div>
          )}

          {/* DB Results — grouped by type */}
          {!loading && Object.keys(groupedResults).length > 0 && (
            <div className="py-1.5">
              {Object.entries(groupedResults).map(([type, items]) => {
                const meta = TYPE_META[type] || TYPE_META.page;
                const Icon = meta.icon;
                return (
                  <div key={type}>
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {type === 'deal' ? 'Brand Deals' : type === 'task' ? 'Tasks' : 'Team Members'}
                    </p>
                    {items.map((item, i) => {
                      const globalIdx = allItems.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item)}
                          onMouseEnter={() => setSelected(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${selected === globalIdx ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                        >
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                            <Icon size={13} />
                          </span>
                          <div className="flex-1 text-left min-w-0">
                            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100 truncate">{item.title}</p>
                            <p className="text-[11px] text-gray-400 truncate">{item.subtitle}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${meta.color} flex-shrink-0`}>
                            {meta.label}
                          </span>
                          {selected === globalIdx && <ArrowRight size={12} className="text-indigo-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
              <div className="border-t border-gray-50 dark:border-gray-800 mt-1" />
            </div>
          )}

          {/* Pages section */}
          {!loading && filteredPages.length > 0 && (
            <div className="py-1.5">
              <p className="px-3 pt-1.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {query ? 'Pages' : 'Quick Navigation'}
              </p>
              {filteredPages.map((item) => {
                const Icon = item.icon || LayoutDashboard;
                const globalIdx = allItems.indexOf(item);
                return (
                  <button
                    key={item.url}
                    onClick={() => navigateTo(item)}
                    onMouseEnter={() => setSelected(globalIdx)}
                    className={`w-full flex items-center gap-3 px-3 py-2 transition-colors ${selected === globalIdx ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                  >
                    <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-gray-500" />
                    </span>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">{item.title}</p>
                      <p className="text-[11px] text-gray-400 truncate">{item.subtitle}</p>
                    </div>
                    {selected === globalIdx && <ArrowRight size={12} className="text-indigo-400 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Footer hint */}
          <div className="border-t border-gray-50 dark:border-gray-800 px-3 py-2 flex items-center gap-3 text-[11px] text-gray-400 bg-gray-50/60 dark:bg-gray-800/30">
            <span><kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 text-[10px]">↑↓</kbd> navigate</span>
            <span><kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 text-[10px]">↵</kbd> open</span>
            <span><kbd className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-1 py-0.5 text-[10px]">Esc</kbd> close</span>
          </div>
        </div>
      )}
    </div>
  );
}
