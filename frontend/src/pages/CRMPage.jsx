import React, { useState } from 'react';
import {
  Plus, Search, Filter, MoreHorizontal, DollarSign, Calendar,
  ChevronDown, Briefcase, FileText, Send, X, CheckCircle, Clock, AlertTriangle
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  lead:        { label: 'Lead',        color: 'bg-gray-100 text-gray-600',     dot: 'bg-gray-400' },
  negotiation: { label: 'Negotiating', color: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-400' },
  active:      { label: 'Active',      color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400' },
  delivered:   { label: 'Delivered',   color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-400' },
  completed:   { label: 'Completed',   color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400' },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-100 text-red-600',       dot: 'bg-red-400' },
};

const INITIAL_DEALS = [
  { id: 1, brand: 'Nike', category: 'Sports', value: 8500, status: 'active', due: '2026-05-10', contact: 'Sarah Kim', deliverables: 'YouTube Review + 3 IG posts', paid: false },
  { id: 2, brand: 'Spotify', category: 'Music', value: 4200, status: 'negotiation', due: '2026-04-28', contact: 'Tom Reed', deliverables: '2 YouTube integrations', paid: false },
  { id: 3, brand: 'Adobe', category: 'Software', value: 12000, status: 'delivered', due: '2026-04-15', contact: 'Priya Sharma', deliverables: 'Tutorial series (4 videos)', paid: true },
  { id: 4, brand: 'Samsung', category: 'Tech', value: 9800, status: 'lead', due: '2026-06-01', contact: 'James Park', deliverables: 'Phone unboxing + review', paid: false },
  { id: 5, brand: 'Skillshare', category: 'Education', value: 3500, status: 'completed', due: '2026-03-30', contact: 'Anna Müller', deliverables: 'Class promotion reel', paid: true },
  { id: 6, brand: 'Notion', category: 'Productivity', value: 5600, status: 'active', due: '2026-05-22', contact: 'David Lee', deliverables: 'Workflow tutorial + IG stories', paid: false },
];

const EMPTY_DEAL = { brand: '', category: '', value: '', status: 'lead', due: '', contact: '', deliverables: '' };

function DealModal({ deal, onClose, onSave }) {
  const [form, setForm] = useState(deal || EMPTY_DEAL);
  const isEdit = !!deal?.id;

  const handleSave = () => {
    if (!form.brand || !form.value) { toast.error('Brand and value required'); return; }
    onSave({ ...form, id: deal?.id || Date.now(), value: Number(form.value), paid: deal?.paid || false });
    onClose();
    toast.success(isEdit ? 'Deal updated' : 'Deal created');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">{isEdit ? 'Edit Deal' : 'New Brand Deal'}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Brand Name *</label>
              <input className="input" placeholder="e.g. Nike" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} />
            </div>
            <div>
              <label className="label">Category</label>
              <input className="input" placeholder="e.g. Sports" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Deal Value ($) *</label>
              <input className="input" type="number" placeholder="0" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Contact Person</label>
              <input className="input" placeholder="Name" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} />
            </div>
            <div>
              <label className="label">Due Date</label>
              <input className="input" type="date" value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Deliverables</label>
            <textarea className="input resize-none" rows={2} placeholder="What are you delivering?" value={form.deliverables} onChange={e => setForm(p => ({ ...p, deliverables: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} className="btn-primary flex-1 justify-center">
            {isEdit ? 'Save Changes' : 'Create Deal'}
          </button>
        </div>
      </div>
    </div>
  );
}

function PipelineView({ deals, onEdit, onStatusChange }) {
  const stages = ['lead', 'negotiation', 'active', 'delivered', 'completed'];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {stages.map(stage => {
        const sc = STATUS_CONFIG[stage];
        const stagDeals = deals.filter(d => d.status === stage);
        return (
          <div key={stage} className="flex-shrink-0 w-64">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${sc.dot}`} />
              <span className="text-sm font-semibold text-gray-700">{sc.label}</span>
              <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">{stagDeals.length}</span>
            </div>
            <div className="space-y-2">
              {stagDeals.map(deal => (
                <div key={deal.id} className="card p-3 cursor-pointer hover:shadow-card-hover transition-shadow" onClick={() => onEdit(deal)}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                      {deal.brand[0]}
                    </div>
                    <span className="text-xs text-gray-400">{deal.category}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{deal.brand}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{deal.deliverables}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-gray-900">${deal.value.toLocaleString()}</span>
                    {deal.paid && <span className="badge bg-emerald-50 text-emerald-600 text-[10px]">Paid</span>}
                  </div>
                  {deal.due && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <Calendar size={10} />
                      {deal.due}
                    </div>
                  )}
                </div>
              ))}
              {stagDeals.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">
                  No deals
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CRMPage() {
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [view, setView] = useState('table'); // 'table' | 'pipeline'
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modal, setModal] = useState(null); // null | 'new' | deal obj

  const filtered = deals.filter(d => {
    const matchSearch = d.brand.toLowerCase().includes(search.toLowerCase()) ||
      d.contact.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const activeValue = deals.filter(d => d.status === 'active').reduce((sum, d) => sum + d.value, 0);
  const paidValue = deals.filter(d => d.paid).reduce((sum, d) => sum + d.value, 0);

  const saveDeal = (deal) => {
    setDeals(prev => {
      const idx = prev.findIndex(d => d.id === deal.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = deal; return n; }
      return [...prev, deal];
    });
  };

  const markPaid = (id) => {
    setDeals(prev => prev.map(d => d.id === id ? { ...d, paid: true } : d));
    toast.success('Marked as paid');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand CRM</h1>
          <p className="text-gray-500 mt-1">Manage partnerships, contracts, and invoices</p>
        </div>
        <button onClick={() => setModal('new')} className="btn-primary">
          <Plus size={16} /> New Deal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pipeline', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-brand-600 bg-brand-50' },
          { label: 'Active Deals', value: `$${activeValue.toLocaleString()}`, icon: Briefcase, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Revenue Received', value: `$${paidValue.toLocaleString()}`, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
          { label: 'Pending Deals', value: deals.filter(d => !['completed', 'cancelled'].includes(d.status)).length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9 py-2"
            placeholder="Search brands or contacts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-auto py-2"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {['table', 'pipeline'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-all capitalize',
                view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              )}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Views */}
      {view === 'pipeline' ? (
        <PipelineView deals={filtered} onEdit={setModal} onStatusChange={() => {}} />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Brand', 'Contact', 'Value', 'Status', 'Due Date', 'Deliverables', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(deal => {
                const sc = STATUS_CONFIG[deal.status];
                return (
                  <tr key={deal.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">{deal.brand[0]}</div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{deal.brand}</p>
                          <p className="text-xs text-gray-400">{deal.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{deal.contact}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">${deal.value.toLocaleString()}</p>
                      {deal.paid && <span className="text-xs text-emerald-600">Paid</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${sc.color}`}>{sc.label}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{deal.due || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-48 truncate">{deal.deliverables}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {!deal.paid && deal.status === 'delivered' && (
                          <button onClick={() => markPaid(deal.id)} className="btn-ghost text-xs py-1 px-2 text-emerald-600">
                            <DollarSign size={12} /> Mark Paid
                          </button>
                        )}
                        <button onClick={() => setModal(deal)} className="btn-ghost text-xs py-1 px-2">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No deals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <DealModal
          deal={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveDeal}
        />
      )}
    </div>
  );
}
