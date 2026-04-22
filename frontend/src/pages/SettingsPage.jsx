import React, { useState } from 'react';
import { User, Lock, Bell, Youtube, Instagram, Globe, Shield, CreditCard, Check, Moon, Sun, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import api from '../services/api';

const TABS = [
  { id: 'profile',      label: 'Profile',      icon: User     },
  { id: 'appearance',  label: 'Appearance',   icon: Sun      },
  { id: 'platforms',   label: 'Platforms',    icon: Globe    },
  { id: 'notifications',label: 'Notifications',icon: Bell    },
  { id: 'security',    label: 'Security',     icon: Shield   },
  { id: 'billing',     label: 'Billing',      icon: CreditCard },
];

const PLATFORMS = [
  {
    id: 'youtube', name: 'YouTube', bg: 'bg-red-50', connected: true, handle: '@YourChannel',
    logo: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>),
  },
  {
    id: 'instagram', name: 'Instagram', bg: 'bg-purple-50', connected: true, handle: '@yourhandle',
    logo: (<svg viewBox="0 0 24 24" className="w-5 h-5"><defs><linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F58529"/><stop offset="50%" stopColor="#DD2A7B"/><stop offset="100%" stopColor="#8134AF"/></linearGradient></defs><path fill="url(#ig2)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>),
  },
  {
    id: 'tiktok', name: 'TikTok', bg: 'bg-gray-100', connected: false, handle: null,
    logo: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="#010101"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>),
  },
  {
    id: 'twitter', name: 'X / Twitter', bg: 'bg-gray-100', connected: false, handle: null,
    logo: (<svg viewBox="0 0 24 24" className="w-5 h-5" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.628 5.905-5.628zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>),
  },
];

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '', location: user?.location || '' });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const avatarInputRef = React.useRef(null);
  const [platforms, setPlatforms] = useState(PLATFORMS);
  // Load notifications from MongoDB user object
  const [notifications, setNotifications] = useState(
    user?.notifications || {
      brandAlerts: true, taskReminders: true, aiSuggestions: true,
      weeklyReport: true, newMessages: false, paymentReceived: true,
    }
  );

  const saveProfile = async () => {
    try {
      const res = await api.put('/auth/profile', {
        name: profile.name, email: profile.email,
        bio: profile.bio, location: profile.location,
      });
      updateProfile(res.data.user); // sync MongoDB response to local state
      toast.success('Profile saved to account!');
    } catch {
      toast.error('Could not save profile.');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be smaller than 5MB'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result;
      setAvatarPreview(base64);
      updateProfile({ avatar: base64 }); // instant UI update
      try {
        await api.put('/auth/profile', { avatar: base64 }); // save to MongoDB
        toast.success('Profile photo saved!');
      } catch {
        toast.error('Could not save photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  const saveNotifications = async (updated) => {
    setNotifications(updated);
    updateProfile({ notifications: updated });
    try {
      await api.put('/auth/profile', { notifications: updated }); // save to MongoDB
    } catch {
      toast.error('Could not save notification settings.');
    }
  };
  const togglePlatform = (id) => {
    setPlatforms(prev => prev.map(p => p.id === id ? { ...p, connected: !p.connected, handle: p.connected ? null : `@${id}user` } : p));
    toast.success(platforms.find(p => p.id === id)?.connected ? 'Platform disconnected' : 'Platform connected');
  };

  const PLANS = [
    { id: 'starter', name: 'Starter', price: 'Free', features: ['1 platform', 'Basic analytics', '5 brand deals/mo'] },
    { id: 'professional', name: 'Professional', price: '$29/mo', features: ['All platforms', 'AI recommendations', 'Unlimited deals', 'Team (up to 5)'] },
    { id: 'agency', name: 'Agency', price: '$99/mo', features: ['Multi-creator', 'White-label reports', 'Priority API', 'Dedicated support'] },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-52 flex-shrink-0">
          <div className="card p-2 space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left',
                  tab === id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon size={17} className="flex-shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {tab === 'appearance' && (
            <div className="card p-6 space-y-6">
              <div>
                <h2 className="font-semibold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-500 mt-1">Choose how CreatorVerse looks for you.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Light Mode Card */}
                <button
                  onClick={() => !isDark ? null : toggleTheme()}
                  className={clsx(
                    'relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group',
                    !isDark
                      ? 'border-brand-500 bg-brand-50/50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {/* Preview */}
                  <div className="w-full h-24 rounded-xl bg-gray-100 overflow-hidden mb-3 border border-gray-200">
                    <div className="h-6 bg-white border-b border-gray-200 flex items-center px-2 gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <div className="w-8 h-1.5 rounded-full bg-gray-200 ml-1" />
                    </div>
                    <div className="p-2 space-y-1.5">
                      <div className="w-full h-2 rounded-full bg-white border border-gray-200" />
                      <div className="w-3/4 h-2 rounded-full bg-white border border-gray-200" />
                      <div className="flex gap-1 mt-2">
                        <div className="w-8 h-4 rounded-md bg-brand-500" />
                        <div className="w-10 h-4 rounded-md bg-gray-200" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun size={15} className="text-amber-500" />
                      <span className="text-sm font-semibold text-gray-900">Light</span>
                    </div>
                    {!isDark && (
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-600 bg-brand-100 px-2 py-0.5 rounded-full">
                        <Check size={10} /> Active
                      </span>
                    )}
                  </div>
                </button>

                {/* Dark Mode Card */}
                <button
                  onClick={() => isDark ? null : toggleTheme()}
                  className={clsx(
                    'relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group',
                    isDark
                      ? 'border-brand-500 bg-brand-900/20 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                >
                  {/* Preview */}
                  <div className="w-full h-24 rounded-xl bg-gray-900 overflow-hidden mb-3 border border-gray-700">
                    <div className="h-6 bg-gray-800 border-b border-gray-700 flex items-center px-2 gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-600" />
                      <div className="w-8 h-1.5 rounded-full bg-gray-700 ml-1" />
                    </div>
                    <div className="p-2 space-y-1.5">
                      <div className="w-full h-2 rounded-full bg-gray-800 border border-gray-700" />
                      <div className="w-3/4 h-2 rounded-full bg-gray-800 border border-gray-700" />
                      <div className="flex gap-1 mt-2">
                        <div className="w-8 h-4 rounded-md bg-brand-600" />
                        <div className="w-10 h-4 rounded-md bg-gray-700" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon size={15} className="text-indigo-400" />
                      <span className="text-sm font-semibold text-gray-900">Dark</span>
                    </div>
                    {isDark && (
                      <span className="flex items-center gap-1 text-xs font-medium text-brand-400 bg-brand-900/40 px-2 py-0.5 rounded-full">
                        <Check size={10} /> Active
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Toggle row */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                    isDark ? 'bg-indigo-900/40' : 'bg-amber-50'
                  )}>
                    {isDark ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{isDark ? 'Dark Mode' : 'Light Mode'}</p>
                    <p className="text-xs text-gray-500">{isDark ? 'Easy on the eyes at night' : 'Clean and bright interface'}</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={clsx(
                    'w-12 h-6 rounded-full relative transition-all duration-300 flex-shrink-0',
                    isDark ? 'bg-brand-600' : 'bg-gray-200'
                  )}
                >
                  <span className={clsx(
                    'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300',
                    isDark ? 'translate-x-6' : 'translate-x-0.5'
                  )} />
                </button>
              </div>
            </div>
          )}


          {tab === 'profile' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Profile Information</h2>
              {/* Avatar upload */}
              <div className="flex items-center gap-5">
                <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-offset-2 ring-brand-200 flex-shrink-0">
                    {avatarPreview
                      ? <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">{profile.name[0]?.toUpperCase() || 'U'}</div>
                    }
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="btn-primary text-xs px-4"
                  >
                    Upload Photo
                  </button>
                  {avatarPreview && (
                    <button
                      onClick={async () => {
                        setAvatarPreview(null);
                        updateProfile({ avatar: '' });
                        try {
                          await api.put('/auth/profile', { avatar: '' }); // remove from MongoDB
                          toast.success('Photo removed');
                        } catch {
                          toast.error('Could not remove photo.');
                        }
                      }}
                      className="block btn-secondary text-xs px-4 text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Remove Photo
                    </button>
                  )}
                  <p className="text-xs text-gray-400">JPG, PNG or GIF · Max 5MB</p>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Bio</label>
                  <textarea className="input resize-none" rows={3} placeholder="Tell brands about yourself..." value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} />
                </div>
              </div>
              <button onClick={saveProfile} className="btn-primary">Save Changes</button>
            </div>
          )}

          {tab === 'platforms' && (
            <div className="card p-6 space-y-4">
              <h2 className="font-semibold text-gray-900">Connected Platforms</h2>
              <p className="text-sm text-gray-500">Connect your social accounts to sync analytics and enable AI features.</p>
              <div className="space-y-3">
                {platforms.map(p => {
                  return (
                    <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.bg}`}>
                        {p.logo}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.connected ? p.handle : 'Not connected'}</p>
                      </div>
                      {p.connected && (
                        <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Check size={12} /> Connected
                        </span>
                      )}
                      <button
                        onClick={() => togglePlatform(p.id)}
                        className={p.connected ? 'btn-secondary text-xs text-red-500 border-red-200 hover:bg-red-50' : 'btn-primary text-xs'}
                      >
                        {p.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Notification Preferences</h2>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, val]) => {
                  const labels = {
                    brandAlerts: { title: 'Brand Deal Alerts', desc: 'Deadlines, new proposals, and deal updates' },
                    taskReminders: { title: 'Task Reminders', desc: 'Due dates and overdue task notifications' },
                    aiSuggestions: { title: 'AI Recommendations', desc: 'New content ideas and brand matches' },
                    weeklyReport: { title: 'Weekly Report', desc: 'Your performance summary every Monday' },
                    newMessages: { title: 'New Messages', desc: 'Messages from team members and freelancers' },
                    paymentReceived: { title: 'Payment Received', desc: 'Escrow releases and payment confirmations' },
                  };
                  const { title, desc } = labels[key] || { title: key, desc: '' };
                  return (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        onClick={() => saveNotifications({ ...notifications, [key]: !notifications[key] })}
                        className={clsx('w-11 h-6 rounded-full transition-colors relative flex-shrink-0',
                          val ? 'bg-brand-600' : 'bg-gray-200'
                        )}
                      >
                        <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
                          val ? 'translate-x-5' : 'translate-x-0.5'
                        )} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => toast.success('Notification preferences saved')} className="btn-primary">Save Preferences</button>
            </div>
          )}

          {tab === 'security' && (
            <div className="card p-6 space-y-5">
              <h2 className="font-semibold text-gray-900">Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input className="input" type="password" placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input className="input" type="password" placeholder="Repeat password" />
                </div>
                <button onClick={() => toast.success('Password updated')} className="btn-primary">Update Password</button>
              </div>
              <div className="border-t border-gray-100 pt-5 space-y-3">
                <h3 className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                <button className="btn-secondary text-sm">Enable 2FA</button>
              </div>
            </div>
          )}

          {tab === 'billing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(plan => (
                  <div key={plan.id} className={clsx('card p-5 space-y-3', plan.id === 'professional' && 'border-brand-300 ring-2 ring-brand-100')}>
                    {plan.id === 'professional' && (
                      <span className="badge bg-brand-100 text-brand-700 text-[10px] mb-1">Current Plan</span>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{plan.name}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{plan.price}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                          <Check size={12} className="text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <button className={plan.id === 'professional' ? 'btn-secondary w-full justify-center text-xs' : 'btn-primary w-full justify-center text-xs'}>
                      {plan.id === 'professional' ? 'Current Plan' : 'Upgrade'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
