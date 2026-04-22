/**
 * In-memory data store — used when MongoDB is unavailable (dev / demo mode).
 * Gives every demo user a realistic dataset out of the box.
 */
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ── Seed data ──────────────────────────────────────────────────────────────
const hashedPassword = bcrypt.hashSync('demo1234', 10);

const DEMO_USER = {
  _id: 'demo-user-1',
  name: 'Admin',
  email: 'demo@creatorverse.ai',
  password: hashedPassword,
  plan: 'professional',
  platforms: ['youtube', 'instagram'],
  createdAt: new Date('2026-01-10'),
};

let users = [DEMO_USER];

let deals = [
  { _id: uuidv4(), userId: 'demo-user-1', brand: 'Nike', category: 'Sports', value: 8500, status: 'active', due: '2026-05-10', contact: 'Sarah Kim', deliverables: 'YouTube Review + 3 IG posts', paid: false, createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', brand: 'Spotify', category: 'Music', value: 4200, status: 'negotiation', due: '2026-04-28', contact: 'Tom Reed', deliverables: '2 YouTube integrations', paid: false, createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', brand: 'Adobe', category: 'Software', value: 12000, status: 'delivered', due: '2026-04-15', contact: 'Priya Sharma', deliverables: 'Tutorial series (4 videos)', paid: true, createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', brand: 'Samsung', category: 'Tech', value: 9800, status: 'lead', due: '2026-06-01', contact: 'James Park', deliverables: 'Phone unboxing + review', paid: false, createdAt: new Date() },
];

let tasks = [
  { _id: uuidv4(), userId: 'demo-user-1', title: 'Edit YouTube video #47 — iPhone review', status: 'in_progress', assignee: 'Alex Chen', priority: 'high', due: '2026-04-23', tags: ['video', 'editing'], createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', title: 'Review Nike brand proposal contract', status: 'review', assignee: 'You', priority: 'high', due: '2026-04-22', tags: ['brand', 'legal'], createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', title: 'Schedule Instagram posts for next week', status: 'todo', assignee: 'Maya Patel', priority: 'medium', due: '2026-04-25', tags: ['social'], createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', title: 'Create thumbnail for unboxing video', status: 'in_progress', assignee: 'Ravi Kumar', priority: 'medium', due: '2026-04-24', tags: ['design'], createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', title: 'Deliver Adobe tutorial final cut', status: 'done', assignee: 'Alex Chen', priority: 'high', due: '2026-04-14', tags: ['video', 'brand'], createdAt: new Date() },
];

let teamMembers = [
  { _id: uuidv4(), userId: 'demo-user-1', name: 'Alex Chen', role: 'editor', email: 'alex@studio.com', avatar: 'A', createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', name: 'Maya Patel', role: 'manager', email: 'maya@studio.com', avatar: 'M', createdAt: new Date() },
  { _id: uuidv4(), userId: 'demo-user-1', name: 'Ravi Kumar', role: 'designer', email: 'ravi@studio.com', avatar: 'R', createdAt: new Date() },
];

// ── CRUD Helpers ───────────────────────────────────────────────────────────
const store = {
  // Users
  findUserByEmail: (email) => users.find(u => u.email === email) || null,
  findUserById: (id) => users.find(u => u._id === id) || null,
  createUser: (data) => {
    const user = { _id: uuidv4(), ...data, createdAt: new Date() };
    users.push(user);
    return user;
  },

  // Deals
  getDeals: (userId, filters = {}) => {
    let result = deals.filter(d => d.userId === userId);
    if (filters.status) result = result.filter(d => d.status === filters.status);
    if (filters.search) result = result.filter(d =>
      d.brand.toLowerCase().includes(filters.search.toLowerCase())
    );
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  getDeal: (id, userId) => deals.find(d => d._id === id && d.userId === userId) || null,
  createDeal: (data) => {
    const deal = { _id: uuidv4(), ...data, createdAt: new Date() };
    deals.push(deal);
    return deal;
  },
  updateDeal: (id, userId, updates) => {
    const idx = deals.findIndex(d => d._id === id && d.userId === userId);
    if (idx < 0) return null;
    deals[idx] = { ...deals[idx], ...updates, updatedAt: new Date() };
    return deals[idx];
  },
  deleteDeal: (id, userId) => {
    const idx = deals.findIndex(d => d._id === id && d.userId === userId);
    if (idx < 0) return false;
    deals.splice(idx, 1);
    return true;
  },

  // Tasks
  getTasks: (userId) => tasks.filter(t => t.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  createTask: (data) => {
    const task = { _id: uuidv4(), ...data, createdAt: new Date() };
    tasks.push(task);
    return task;
  },
  updateTask: (id, userId, updates) => {
    const idx = tasks.findIndex(t => t._id === id && t.userId === userId);
    if (idx < 0) return null;
    tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date() };
    return tasks[idx];
  },
  deleteTask: (id, userId) => {
    const idx = tasks.findIndex(t => t._id === id && t.userId === userId);
    if (idx < 0) return false;
    tasks.splice(idx, 1);
    return true;
  },

  // Team
  getTeamMembers: (userId) => teamMembers.filter(m => m.userId === userId),
  addTeamMember: (data) => {
    const member = { _id: uuidv4(), ...data, createdAt: new Date() };
    teamMembers.push(member);
    return member;
  },
  removeTeamMember: (id, userId) => {
    const idx = teamMembers.findIndex(m => m._id === id && m.userId === userId);
    if (idx < 0) return false;
    teamMembers.splice(idx, 1);
    return true;
  },
};

module.exports = store;
