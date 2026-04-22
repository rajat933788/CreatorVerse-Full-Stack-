import React, { useState } from 'react';
import { Search, Star, MapPin, Briefcase, Filter, Plus, X, DollarSign, Check, Calendar } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Video Editing', 'Graphic Design', 'Copywriting', 'Thumbnail Design', 'Motion Graphics', 'SEO', 'Social Media'];

const FREELANCERS = [
  { id: 1, name: 'Priya Sharma', skill: 'Video Editor', location: 'Mumbai, IN', rating: 4.9, reviews: 142, rate: 45, avatar: 'P', tags: ['YouTube', 'Color Grading', 'After Effects'], category: 'Video Editing', bio: 'Professional video editor with 5+ years in creator content. Specialized in YouTube long-form and Reels.', verified: true },
  { id: 2, name: 'Alex Thompson', skill: 'Thumbnail Designer', location: 'London, UK', rating: 4.8, reviews: 98, rate: 35, avatar: 'A', tags: ['Photoshop', 'CTR Optimization', 'YouTube'], category: 'Thumbnail Design', bio: 'Designed thumbnails for channels with 1M+ subscribers. Average CTR improvement: 2.4x.', verified: true },
  { id: 3, name: 'Riya Mehta', skill: 'Copywriter & Scriptwriter', location: 'Delhi, IN', rating: 4.7, reviews: 64, rate: 30, avatar: 'R', tags: ['Scripts', 'SEO', 'Hooks'], category: 'Copywriting', bio: 'YouTube script writer with deep understanding of retention hooks, pacing and SEO.', verified: false },
  { id: 4, name: 'Carlos Rivera', skill: 'Motion Graphics', location: 'Bogotá, CO', rating: 4.9, reviews: 211, rate: 55, avatar: 'C', tags: ['After Effects', 'Cinema 4D', 'Intros'], category: 'Motion Graphics', bio: 'Crafting stunning motion graphics and intros for top creators. Award-winning designer.', verified: true },
  { id: 5, name: 'Yuki Tanaka', skill: 'Graphic Designer', location: 'Tokyo, JP', rating: 4.6, reviews: 77, rate: 40, avatar: 'Y', tags: ['Brand Identity', 'Illustrator', 'Canva'], category: 'Graphic Design', bio: 'Minimal, aesthetic design for creator brands. Covers banners, merch, and brand kits.', verified: true },
  { id: 6, name: 'Nadia Okafor', skill: 'Social Media Manager', location: 'Lagos, NG', rating: 4.8, reviews: 55, rate: 25, avatar: 'N', tags: ['Instagram', 'TikTok', 'Scheduling'], category: 'Social Media', bio: 'Full-service social media management for creators. Growth-focused strategies.', verified: false },
];

const LISTINGS = [
  { id: 1, title: 'Need experienced YouTube video editor', category: 'Video Editing', budget: '₹15,000 – ₹25,000', deadline: '2026-05-01', proposals: 6, status: 'open' },
  { id: 2, title: 'Thumbnail designer for tech channel', category: 'Thumbnail Design', budget: '$200 – $400/mo', deadline: '2026-04-30', proposals: 12, status: 'open' },
  { id: 3, title: 'Instagram Reels editor (part-time)', category: 'Video Editing', budget: '$800/mo', deadline: '2026-05-10', proposals: 4, status: 'open' },
];

function FreelancerCard({ f, onHire }) {
  return (
    <div className="card p-5 card-hover space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
          {f.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-gray-900 text-sm">{f.name}</p>
            {f.verified && <Check size={13} className="text-emerald-500 flex-shrink-0" />}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{f.skill}</p>
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <MapPin size={10} /> {f.location}
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">${f.rate}<span className="text-xs text-gray-400">/hr</span></p>
          <div className="flex items-center gap-1 justify-end mt-0.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-600 font-medium">{f.rating}</span>
            <span className="text-xs text-gray-400">({f.reviews})</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">{f.bio}</p>

      <div className="flex flex-wrap gap-1">
        {f.tags.map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{t}</span>
        ))}
      </div>

      <div className="flex gap-2 pt-1 border-t border-gray-50">
        <button className="btn-secondary flex-1 justify-center text-xs py-1.5">View Profile</button>
        <button onClick={() => onHire(f)} className="btn-primary flex-1 justify-center text-xs py-1.5">Hire Now</button>
      </div>
    </div>
  );
}

function HireModal({ freelancer, onClose }) {
  const [form, setForm] = useState({ project: '', budget: '', deadline: '', notes: '' });

  const submit = () => {
    if (!form.project) { toast.error('Project description required'); return; }
    toast.success(`Hire request sent to ${freelancer.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {freelancer.avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{freelancer.name}</p>
              <p className="text-xs text-gray-400">{freelancer.skill} · ${freelancer.rate}/hr</p>
            </div>
          </div>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="label">Project Description *</label>
            <textarea className="input resize-none" rows={3} placeholder="Describe what you need..." value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Budget</label>
              <input className="input" placeholder="e.g. $500" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} />
            </div>
            <div>
              <label className="label">Deadline</label>
              <input className="input" type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="label">Additional Notes</label>
            <textarea className="input resize-none" rows={2} placeholder="Any specific requirements..." value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button onClick={submit} className="btn-primary flex-1 justify-center">Send Request</button>
        </div>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [tab, setTab] = useState('freelancers');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [hireModal, setHireModal] = useState(null);

  const filtered = FREELANCERS.filter(f => {
    const matchCat = category === 'All' || f.category === category;
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.skill.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Talent Marketplace</h1>
          <p className="text-gray-500 mt-1">Find verified freelancers for your content team</p>
        </div>
        <button className="btn-primary">
          <Plus size={16} /> Post a Job
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {['freelancers', 'my_listings'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={clsx('px-4 py-2 rounded-lg text-sm font-medium transition-all',
              tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}>
            {t === 'freelancers' ? 'Find Talent' : 'My Job Listings'}
          </button>
        ))}
      </div>

      {tab === 'freelancers' ? (
        <>
          {/* Search + Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-56">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9 py-2" placeholder="Search freelancers, skills..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={clsx('px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                  category === c
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                )}>
                {c}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(f => (
              <FreelancerCard key={f.id} f={f} onHire={setHireModal} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-16 text-gray-400">
                <Briefcase size={32} className="mx-auto mb-3 opacity-40" />
                <p>No freelancers found for your search</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {LISTINGS.map(l => (
            <div key={l.id} className="card p-5 flex items-center gap-4 flex-wrap card-hover">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900">{l.title}</p>
                  <span className="badge bg-emerald-100 text-emerald-700">{l.status}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span className="flex items-center gap-1"><Briefcase size={12} /> {l.category}</span>
                  <span className="flex items-center gap-1"><DollarSign size={12} /> {l.budget}</span>
                  <span className="flex items-center gap-1"><Calendar size={12} /> Due {l.deadline}</span>
                  <span className="font-medium text-brand-600">{l.proposals} proposals</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary text-xs">View Proposals</button>
                <button className="btn-ghost text-xs text-red-500 hover:bg-red-50">Close</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {hireModal && <HireModal freelancer={hireModal} onClose={() => setHireModal(null)} />}
    </div>
  );
}
