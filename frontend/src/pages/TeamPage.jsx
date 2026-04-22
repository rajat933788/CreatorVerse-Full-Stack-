import React, { useState } from 'react';
import { Plus, X, User, Calendar, Tag, MoreHorizontal, UserPlus, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

const COLUMNS = [
  { id: 'todo',        label: 'To Do',       color: 'bg-gray-100 text-gray-600',      header: 'border-gray-300' },
  { id: 'in_progress', label: 'In Progress',  color: 'bg-blue-100 text-blue-700',      header: 'border-blue-400' },
  { id: 'review',      label: 'Review',       color: 'bg-amber-100 text-amber-700',    header: 'border-amber-400' },
  { id: 'done',        label: 'Done',         color: 'bg-emerald-100 text-emerald-700', header: 'border-emerald-400' },
];

const PRIORITY = {
  low:    { label: 'Low',    color: 'bg-gray-100 text-gray-500' },
  medium: { label: 'Medium', color: 'bg-amber-100 text-amber-600' },
  high:   { label: 'High',   color: 'bg-red-100 text-red-600' },
};

const INIT_TASKS = [
  { id: 1, title: 'Edit YouTube video #47 — iPhone review', status: 'in_progress', assignee: 'Alex Chen', priority: 'high', due: '2026-04-23', tags: ['video', 'editing'] },
  { id: 2, title: 'Review Nike brand proposal contract', status: 'review', assignee: 'You', priority: 'high', due: '2026-04-22', tags: ['brand', 'legal'] },
  { id: 3, title: 'Schedule Instagram posts for next week', status: 'todo', assignee: 'Maya Patel', priority: 'medium', due: '2026-04-25', tags: ['social'] },
  { id: 4, title: 'Create thumbnail for unboxing video', status: 'in_progress', assignee: 'Ravi Kumar', priority: 'medium', due: '2026-04-24', tags: ['design'] },
  { id: 5, title: 'Write script for tech comparison video', status: 'todo', assignee: 'You', priority: 'low', due: '2026-04-28', tags: ['script'] },
  { id: 6, title: 'Deliver Adobe tutorial final cut', status: 'done', assignee: 'Alex Chen', priority: 'high', due: '2026-04-14', tags: ['video', 'brand'] },
  { id: 7, title: 'SEO optimization for channel description', status: 'todo', assignee: 'Maya Patel', priority: 'low', due: '2026-04-30', tags: ['seo'] },
  { id: 8, title: 'Spotify integration recording session', status: 'done', assignee: 'You', priority: 'medium', due: '2026-04-16', tags: ['brand', 'audio'] },
];

const INIT_MEMBERS = [
  { id: 1, name: 'You (Owner)', role: 'admin', avatar: 'Y', email: 'you@creatorverse.ai' },
  { id: 2, name: 'Alex Chen', role: 'editor', avatar: 'A', email: 'alex@studio.com' },
  { id: 3, name: 'Maya Patel', role: 'manager', avatar: 'M', email: 'maya@studio.com' },
  { id: 4, name: 'Ravi Kumar', role: 'designer', avatar: 'R', email: 'ravi@studio.com' },
];

const ROLE_COLORS = {
  admin:    'bg-brand-100 text-brand-700',
  editor:   'bg-blue-100 text-blue-700',
  manager:  'bg-purple-100 text-purple-700',
  designer: 'bg-pink-100 text-pink-700',
};

const EMPTY_TASK = { title: '', assignee: '', priority: 'medium', due: '', tags: '', status: 'todo' };

function TaskCard({ task, onMove, onDelete }) {
  const prio = PRIORITY[task.priority];
  const cols = COLUMNS.filter(c => c.id !== task.status);

  return (
    <div className="card p-3.5 space-y-2.5 group cursor-pointer hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-900 leading-snug flex-1">{task.title}</p>
        <div className="relative flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDelete(task.id)} className="p-1 rounded hover:bg-red-50">
            <Trash2 size={13} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map(t => (
            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded-md font-medium">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
            {task.assignee[0]}
          </div>
          <span className="text-xs text-gray-500">{task.assignee.split(' ')[0]}</span>
        </div>
        <div className="flex items-center gap-2">
          {task.due && (
            <span className="flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar size={10} /> {task.due.slice(5)}
            </span>
          )}
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${prio.color}`}>{prio.label}</span>
        </div>
      </div>

      <div className="flex gap-1 pt-1 border-t border-gray-50">
        {cols.map(c => (
          <button
            key={c.id}
            onClick={() => onMove(task.id, c.id)}
            className={clsx('flex-1 text-[10px] font-medium py-1 rounded-md transition-colors', c.color, 'hover:opacity-80')}
          >
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TaskModal({ colId, members, onClose, onCreate }) {
  const [form, setForm] = useState({ ...EMPTY_TASK, status: colId });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">New Task</h3>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="label text-xs">Task Title *</label>
            <input className="input text-sm" placeholder="What needs to be done?" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs">Assignee</label>
              <select className="input text-sm" value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}>
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.name}>{m.name.split(' ')[0]}</option>)}
              </select>
            </div>
            <div>
              <label className="label text-xs">Priority</label>
              <select className="input text-sm" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                {Object.entries(PRIORITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="label text-xs">Due Date</label>
              <input className="input text-sm" type="date" value={form.due} onChange={e => setForm(p => ({ ...p, due: e.target.value }))} />
            </div>
            <div>
              <label className="label text-xs">Tags (comma sep.)</label>
              <input className="input text-sm" placeholder="video, brand" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 p-4 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center text-xs">Cancel</button>
          <button
            onClick={() => {
              if (!form.title) { toast.error('Task title required'); return; }
              onCreate({ ...form, id: Date.now(), tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] });
              onClose();
              toast.success('Task created');
            }}
            className="btn-primary flex-1 justify-center text-xs"
          >
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [members] = useState(INIT_MEMBERS);
  const [view, setView] = useState('kanban');
  const [modal, setModal] = useState(null); // null | colId string

  const moveTask = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    toast.success('Task moved');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success('Task deleted');
  };

  const createTask = (task) => setTasks(prev => [...prev, task]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Tasks</h1>
          <p className="text-gray-500 mt-1">Manage your content production pipeline</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            {['kanban', 'members'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-all capitalize',
                  view === v ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                )}>
                {v === 'kanban' ? 'Kanban Board' : 'Team Members'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="flex-shrink-0 w-72">
                <div className={clsx('flex items-center justify-between mb-3 pb-2 border-b-2', col.header)}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.color}`}>{col.label}</span>
                    <span className="text-xs text-gray-400 font-medium">{colTasks.length}</span>
                  </div>
                  <button
                    onClick={() => setModal(col.id)}
                    className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Plus size={13} className="text-gray-500" />
                  </button>
                </div>
                <div className="space-y-2">
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onMove={moveTask} onDelete={deleteTask} />
                  ))}
                  {colTasks.length === 0 && (
                    <div
                      onClick={() => setModal(col.id)}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400 cursor-pointer hover:border-gray-300 hover:text-gray-500 transition-colors"
                    >
                      + Add a task
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Team Members</h3>
              <button className="btn-primary text-xs">
                <UserPlus size={14} /> Invite Member
              </button>
            </div>
            <div className="space-y-3">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {m.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                  <span className={`badge ${ROLE_COLORS[m.role] || 'bg-gray-100 text-gray-600'} capitalize`}>{m.role}</span>
                  <div className="text-xs text-gray-400">
                    {tasks.filter(t => t.assignee.split(' ')[0] === m.name.split(' ')[0]).length} tasks
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Workload Overview</h3>
            <div className="space-y-3">
              {members.map(m => {
                const total = tasks.filter(t => t.assignee.split(' ')[0] === m.name.split(' ')[0]).length;
                const done = tasks.filter(t => t.assignee.split(' ')[0] === m.name.split(' ')[0] && t.status === 'done').length;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {m.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{m.name.split(' ')[0]}</span>
                        <span className="text-xs text-gray-500">{done}/{total} done</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {modal && (
        <TaskModal
          colId={modal}
          members={members}
          onClose={() => setModal(null)}
          onCreate={createTask}
        />
      )}
    </div>
  );
}
