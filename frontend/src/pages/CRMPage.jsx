import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Briefcase, Loader2, DollarSign } from 'lucide-react';
import { crmApi } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  lead: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  negotiation: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400',
  active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400',
  delivered: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
};

export default function CRMPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    brand: '', category: '', value: '', currency: 'USD', status: 'lead', due: '', notes: ''
  });

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await crmApi.getDeals();
      setDeals(res.data?.data || res.data || []);
    } catch (err) {
      toast.error('Failed to load brand deals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleOpenModal = (deal = null) => {
    if (deal) {
      setSelectedDeal(deal);
      setForm({
        brand: deal.brand,
        category: deal.category || '',
        value: deal.value || '',
        currency: deal.currency || 'USD',
        status: deal.status || 'lead',
        due: deal.due || '',
        notes: deal.notes || ''
      });
    } else {
      setSelectedDeal(null);
      setForm({ brand: '', category: '', value: '', currency: 'USD', status: 'lead', due: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, value: Number(form.value) };
      if (selectedDeal) {
        await crmApi.updateDeal(selectedDeal._id, payload);
        toast.success('Deal updated successfully');
      } else {
        await crmApi.createDeal(payload);
        toast.success('New deal added');
      }
      setIsModalOpen(false);
      fetchDeals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save deal');
    }
  };

  const confirmDelete = (deal) => {
    setSelectedDeal(deal);
    setIsDeleteOpen(true);
  };

  const handleDeleteDeal = async () => {
    if (!selectedDeal) return;
    try {
      await crmApi.deleteDeal(selectedDeal._id);
      toast.success('Deal deleted');
      setIsDeleteOpen(false);
      fetchDeals();
    } catch (err) {
      toast.error('Failed to delete deal');
    }
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.brand.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || deal.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statuses = ['all', 'lead', 'negotiation', 'active', 'delivered', 'completed', 'cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Brand CRM</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your sponsorships and brand collaborations.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add New Deal
        </button>
      </div>

      <div className="card bg-white dark:bg-gray-900 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg overflow-x-auto max-w-full">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === s ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              >
                {s}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Briefcase size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No deals found</h3>
            <p className="text-gray-500 max-w-sm">You don't have any brand deals matching your current filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Brand</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeals.map(deal => (
                  <tr key={deal._id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{deal.brand}</td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{deal.category || '—'}</td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-gray-300">
                      {deal.currency === 'INR' ? '₹' : '$'}{deal.value?.toLocaleString() || 0}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[deal.status] || STATUS_COLORS.lead}`}>
                        {deal.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{deal.due || 'No date'}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(deal)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => confirmDelete(deal)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selectedDeal ? 'Edit Deal' : 'Add New Deal'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveDeal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Name *</label>
                  <input required type="text" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <input type="text" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="e.g. Tech, Beauty" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input type="date" value={form.due} onChange={e => setForm({...form, due: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>

                <div className="col-span-2 sm:col-span-1 relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value *</label>
                  <div className="relative">
                    <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="absolute inset-y-0 left-0 pl-3 pr-2 bg-transparent text-gray-500 text-sm border-r border-gray-200 dark:border-gray-700 focus:outline-none">
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                    </select>
                    <input required type="number" min="0" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-20 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white">
                    {statuses.filter(s => s !== 'all').map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                  <textarea rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" placeholder="Add any details about deliverables, constraints..." />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {selectedDeal ? 'Update Deal' : 'Add Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Deal?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Are you sure you want to delete the deal with <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedDeal?.brand}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteDeal} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm shadow-red-600/20">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
