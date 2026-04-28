import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, X, Trash2, Calendar, User, Flag, Loader2 } from 'lucide-react';
import { teamApi } from '../services/api';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' }
];

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400',
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400'
};

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Forms
  const [memberForm, setMemberForm] = useState({ name: '', email: '', role: 'editor' });
  const [taskForm, setTaskForm] = useState({ title: '', assignee: '', priority: 'medium', due: '', status: 'todo' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersRes, tasksRes] = await Promise.all([
        teamApi.getMembers(),
        teamApi.getTasks()
      ]);
      setMembers(membersRes.data?.data || membersRes.data || []);
      setTasks(tasksRes.data?.data || tasksRes.data || []);
    } catch (err) {
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Member Handlers ---
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await teamApi.inviteMember(memberForm);
      toast.success('Team member added');
      setIsMemberModalOpen(false);
      setMemberForm({ name: '', email: '', role: 'editor' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      await teamApi.removeMember(id);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  // --- Task Handlers ---
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await teamApi.createTask(taskForm);
      toast.success('Task created');
      setIsTaskModalOpen(false);
      setTaskForm({ title: '', assignee: '', priority: 'medium', due: '', status: 'todo' });
      fetchData();
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await teamApi.deleteTask(id);
      toast.success('Task deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistically update UI
    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t._id === draggableId);
    if (taskIndex > -1) {
      updatedTasks[taskIndex].status = destination.droppableId;
      setTasks(updatedTasks);

      try {
        await teamApi.moveTask(draggableId, destination.droppableId);
      } catch (err) {
        toast.error('Failed to update task status');
        fetchData(); // revert
      }
    }
  };

  if (loading) {
    return <div className="flex h-[400px] items-center justify-center"><Loader2 size={32} className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Team & Tasks</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your team members and content pipeline.</p>
      </div>

      {/* SECTION 1: Team Members */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
          <button onClick={() => setIsMemberModalOpen(true)} className="btn-secondary text-sm py-1.5 flex items-center gap-1.5">
            <Plus size={16} /> Add Member
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map(member => (
            <div key={member._id} className="card p-5 bg-white dark:bg-gray-900 flex flex-col items-center text-center relative group">
              <button 
                onClick={() => handleRemoveMember(member._id)}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} />
              </button>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl mb-3">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{member.email}</p>
              <div className="flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-[10px] font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  {member.role}
                </span>
                <span className={clsx("px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider", member.status === 'active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400")}>
                  {member.status}
                </span>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="col-span-full card p-8 text-center text-gray-500 dark:text-gray-400">
              No team members yet. Add your first member to collaborate!
            </div>
          )}
        </div>
      </section>

      <hr className="border-gray-200 dark:border-gray-800" />

      {/* SECTION 2: Task Board (Kanban) */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Task Board</h2>
          <button onClick={() => setIsTaskModalOpen(true)} className="btn-primary text-sm py-1.5 flex items-center gap-1.5 shadow-sm shadow-indigo-600/20">
            <Plus size={16} /> Add Task
          </button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4 items-start min-h-[400px]">
            {COLUMNS.map(col => (
              <div key={col.id} className="w-[300px] shrink-0 bg-gray-50/50 dark:bg-gray-800/20 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-200">{col.title}</h3>
                  <span className="text-xs font-bold text-gray-400 bg-gray-200/50 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {tasks.filter(t => t.status === col.id).length}
                  </span>
                </div>
                
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 min-h-[100px]">
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={clsx(
                                "bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border transition-shadow",
                                snapshot.isDragging ? "shadow-xl border-indigo-500 scale-[1.02]" : "border-gray-100 dark:border-gray-700/50 hover:shadow-md"
                              )}
                              style={{ ...provided.draggableProps.style }}
                            >
                              <div className="flex justify-between items-start mb-2 gap-2">
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">{task.title}</h4>
                                <button onClick={() => handleDeleteTask(task._id)} className="text-gray-300 hover:text-red-500 transition-colors mt-0.5">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mb-4">
                                <span className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md", PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium)}>
                                  {task.priority}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto pt-3 border-t border-gray-50 dark:border-gray-800/50">
                                <div className="flex items-center gap-1.5 truncate pr-2">
                                  <User size={12} className="shrink-0" />
                                  <span className="truncate">{task.assignee || 'Unassigned'}</span>
                                </div>
                                {task.due && (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <Calendar size={12} />
                                    <span>{task.due}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </section>

      {/* Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Add Team Member</h3>
              <button onClick={() => setIsMemberModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <input required type="text" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input required type="email" value={memberForm.email} onChange={e => setMemberForm({...memberForm, email: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                <select value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white capitalize">
                  {['editor', 'designer', 'manager', 'writer', 'analyst', 'admin'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button type="button" onClick={() => setIsMemberModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white">Add New Task</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input required type="text" value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                  <input type="text" value={taskForm.assignee} onChange={e => setTaskForm({...taskForm, assignee: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                  <input type="date" value={taskForm.due} onChange={e => setTaskForm({...taskForm, due: e.target.value})} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map(p => (
                    <label key={p} className={clsx("flex-1 text-center py-2 border rounded-lg text-sm font-medium cursor-pointer transition-colors capitalize", taskForm.priority === p ? `border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400` : `border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400`)}>
                      <input type="radio" name="priority" value={p} checked={taskForm.priority === p} onChange={() => setTaskForm({...taskForm, priority: p})} className="hidden" />
                      {p}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-6">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
